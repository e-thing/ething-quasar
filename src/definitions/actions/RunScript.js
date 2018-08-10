export default {

  properties: {
    script: {
      format: 'ething.resource',
      filter: (r) => {
        return (r instanceof EThing.File) && r.mime() == 'application/javascript'
      }
    },
  }

}
