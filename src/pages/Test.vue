<template>
  <q-page padding>

    <pre id="toto" style="display: none;">
# h1 Heading 8-)
<h2> h2 Heading by HTML</h2>
## h2 Heading
### h3 Heading

## Horizontal Rules

___

---

***

## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar


## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

```
Sample text here...
```
Syntax highlighting

``` javascript
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

``` go
package main

import "fmt"

func main() {
	fmt.Println("Hello, world!")
}
```

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

## Links

[vue-markdown](https://github.com/miaolz123/vue-markdown)

[link with title](https://github.com/miaolz123/vue-markdown "VueMarkdown")

Autoconverted link https://github.com/miaolz123/vue-markdown (enable linkify to see)


## Images

![Minion](dist/img/minion.png)

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: dist/img/minion.png  "The Dojocat"


### Emojies

> Classic markup: :wink: :cry: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)


### Subscript / Superscript

- 19^th^
- H~2~O


###

++Inserted text++


###

==Marked text==


### Footnotes

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.


### Definition lists

Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b


### Abbreviations

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language
    </pre>

    <vue-markdown :anchorAttributes="{target: '_blank'}" :source="templ" class="markdown"></vue-markdown>

    <!--
    <button v-on:click="inline=!inline">toggle inline</button> {{ inline }}
    <div>model: {{ model }} {{ type(model) }}</div>
    <div>schema: {{ schema }}</div>
    <div>error: {{ error }}</div>

    <form-schema :schema="schema" :value="model" :inline="inline" @input="model = $event" @error="error = $event"/>
    -->

  </q-page>
</template>

<script>

import VueMarkdown from 'vue-markdown'


export default {
  name: 'PageTest',

  components: {
    VueMarkdown
  },

  data () {



    return {
      templ: 'toto',
      schema: {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "minLength": 1
        },
        "type": {
          "type": "string",
          '$component': "textarea",
          "minLength": 1
        }
      },
      "required": [
        "name"
      ],
      "description": "print some debug information"
    },
model: {
  "name": "Debug Node",
  /*"output": {
    "type": "msg",
    "value": "payload"
  }*/
  /*"color": "#808080",
  "print_log": false*/
},
      /*schema: {
        description: 'my object',
        type: 'object',
        properties: {
          prop1: {
            id: 'prop1',
            type: 'string',
            description: 'foo bar',
            default: 'def1',
            minLength: 5
          },
          prop2: {
            id: 'prop2',
            type: 'string',
            description: 'foo bar',
            default: 'def1',
            minLength: 2,
            '$dependencies': {
              'prop1': function (val, self, dep) {
                this.c_value = val
              }
            }
          },
        }
      },*/
    	/*schema: {
      	type: 'string',
        description: 'foo bar',
        default: 'def',
        minLength: 5
      },*/
      /*model: {
        prop1: 'foo',
        prop2: 'bar',
      },*/
      //model: 'foo',
      error: '?',
      inline: false
    }

  },

  methods: {
    type(obj) {
      return typeof obj
    }
  },

  mounted () {
    /*setTimeout(() => {
    	this.schema.description = 'hello'
      this.model = undefined
    }, 1000)*/

    this.templ = document.getElementById('toto').textContent
  }
}
</script>

<style lang="stylus">


</style>
