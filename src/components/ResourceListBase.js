
const sortItems = [{
  name: 'name',
  label: 'name',
  compare (a, b) {
    return a.name().localeCompare(b.name())
  }
},{
  name: 'date',
  label: 'date',
  compare (a, b) {
    return b.modifiedDate() - a.modifiedDate()
  }
},{
  name: 'type',
  label: 'type',
  compare (a, b) {
    return a.types().reverse().join(' ').localeCompare(b.types().reverse().join(' '))
  },
},{
  name: 'location',
  label: 'location',
  groups (resources) {
    var locations = [];
    resources.forEach(r => {
      var loc = r.attr('location')
      if (loc && locations.indexOf(loc)===-1) {
        locations.push(loc)
      }
    })
    if (!locations.length) return
    var groups = locations.map(loc => {
      return {
        label: loc,
        filter (r) {
          return r.attr('location') === loc
        }
      }
    })
    groups.push({
      label: 'unknown location',
      filter (r) {
        return !r.attr('location')
      }
    })
    return groups
  }
}]

export default {

    props: {
      resources: {},

      /*
      groups: array
      ['resources/Device', {
        label: 'Files',
        filter: 'resources/File'
      }, {
        label: 'Custom',
        icon: 'mdi-file',
        filter: function(resource) {
          return true // or false
        }
      }]
      */
      groups: {},
      hideOtherGroup: Boolean,

      createTypes: {},

      tree: Boolean,

      showHiddenFiles: Boolean,

      defaultSort: String,

    },

    data () {
        return {
          sort_: this.defaultSort || (this.groups ? 'custom' : 'name'), // name
          search_: '',
          filter_ :null // a custom resources filter function
        }
    },

    computed: {

      __sortItems () {
        var res = sortItems.slice()
        if (this.groups) {
          res.unshift({
            name: 'custom',
            label: 'custom',
            groups: this.groups
          })
        }
        return res
      },

      __resources () {
        var resources = [];
        if (typeof this.resources === 'function') {
          resources = this.$ething.arbo.find(this.resources)
        } else if (typeof this.resources === 'string') {
          // blank separated list of types
          resources = this.$ething.arbo.find(this.$ethingUI.resource.typeFilter(this.resources))
        } else if (Array.isArray(this.resources)) {
          resources = this.resources.map(r => {
            if (typeof r === 'string') return this.$ething.arbo.get(r)
            return r
          })
        } else if (typeof this.resources === 'undefined') {
          resources = this.$ething.arbo.find(r => true)
        }
        return resources
      },

      __createTypes () {
        if (typeof this.createTypes !== 'undefined') {
          if (typeof this.createTypes === 'string') {
            return this.createTypes.split(' ').filter(t => !!t)
          } else {
            return this.createTypes
          }
        } else if (typeof this.resources === 'string') {
          return this.resources.split(' ').filter(type => !!type)
        } else if (typeof this.resources === 'undefined') {
          return ['resources/Resource']
        } else {
          return []
        }
      },

      __filteredResources () {

        var resources = this.__resources;

        if (this.filter_) {
          resources = resources.filter(this.filter_)
        }

        if (!this.showHiddenFiles) {
          resources = resources.filter(r => !r.basename().startsWith('.'))
        }

        if (this.search_) {
          resources = resources.filter(this.__makeSearchFilter(search_))
        }

        var sortItem = this.__selectedSortItem
        if (sortItem && sortItem.compare) {
          resources.sort(sortItem.compare)
        }

        return resources
      },

      __groups () {
        var groups;

        var sortItem = this.__selectedSortItem
        if (sortItem && sortItem.groups) {
          if (typeof sortItem.groups === 'function')
            groups = sortItem.groups(this.__filteredResources)
          else
            groups = sortItem.groups
        } else {
          groups = this.groups
        }

        if (groups && Array.isArray(groups)) {

          groups = this.__formatGroupList(groups)
          if (!this.hideOtherGroup) {
            groups.push({ // must be last
              label: 'others',
              icon: null,
              filter: null,
              _others: true
            })
          }

          groups.forEach(group => {
            group.resources = []
          })

          this.__filteredResources.forEach(r => {
            var found = false
            groups.forEach(group => {
              if (group._others) {
                if (!found) {
                  group.resources.push(r)
                }
              } else if(group.filter(r)) {
                found = true
                group.resources.push(r)
              }
            })
          })

          return groups
        }

        return []
      },

      __selectedSortItem () {
        if (typeof this.sort_ === 'string') {
          for (var i in this.__sortItems) {
            if (this.__sortItems[i].name === this.sort_) {
              return this.__sortItems[i]
            }
          }
        }
      }

    },

    methods: {

      __makeTree (resources) {

        var list = []

        var get = id => {
          for(var i in resources) {
            if(resources[i].id() == id) return resources[i]
          }
        }

        var getChildren = resource => {
      		return resources.filter(r => {
      			return r.createdBy() === resource.id()
      		});
      	}

      	var hasParent = resource => {
          var createdById = resource.createdBy()
      		return createdById && get(createdById);
      	}

      	var level = 0;

        var create = resource => {
          return {
            resource,
            level,
          }
        }

        var order = resource => {
          var list = [create(resource)]

          level++;
      		getChildren(resource).map( r => {
      			list = list.concat(order(r))
      		});
      		level--;

          return list
        }

        resources.filter(r => {
    			return !hasParent(r)
        }).forEach(r => {
          list = list.concat(order(r))
        })

        return list
      },

      __makeSearchFilter (search) {
        if (!search) return r => true

        var re_filter = new RegExp(search, 'i')
        return r => {
          return re_filter.test(r.name()) || re_filter.test(r.type()) || re_filter.test(r.description()) || re_filter.test(r.attr('location'))
        }
      },

      __formatGroupList (categories) {
        return categories.map(catItem => {
          if (typeof catItem === 'string') {
            // type name
            var cls = this.$ethingUI.get(catItem)
            var label = cls.title
            var icon = cls.icon
            catItem = {
              label,
              icon,
              filter: catItem
            }
          } else {
            // copy
            catItem = Object.assign({}, catItem)
          }
          if (typeof catItem.filter === 'string') {
            var type = catItem.filter
            if (!catItem.label) {
              catItem.label = this.$ethingUI.get(type).title
            }
            if (!catItem.label) {
              catItem.icon = this.$ethingUI.get(type).icon
            }
            catItem.filter = (r) => this.$ethingUI.isSubclass(r, type)
          }
          return catItem
        })
      },

      __toItems (resources) {
        if (this.tree) {
          return this.__makeTree(resources)
        } else {
          return resources.map(r => {
            return {
              resource: r,
              level: 0
            }
          })
        }
      },

    }


}
