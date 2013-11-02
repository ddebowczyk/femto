classpath "../src,../test"

uses femto.Container
uses femto.Component

uses sample.Logger
uses sample.Api
uses sample.Client

var c = new Container()

c.def(new Component<Logger>("logger"){
  :CArgs = {
    "c:/tmp/log.txt"
  },
  :Properties = {
    Logger#Mode -> "debug"
  }
})

c.def(new Component<Api>("api"){
  :CArgs = {
    "http://www.x.com/",
    "root",
    "pass"
  },
  :Properties = {
    Api#Logger -> c.ref("logger")
  }
})

c.def(new Component<Client>("client"){
  :CArgs = {
    c.ref("api")
  },
  :Properties = {
    Client#Logger -> c.ref("logger")
  }
})

c.def(new Component<Client>("client2"){
    :CArgs = {
        c.ref("api")
    },
    :Properties = {
        Client#Logger -> c.ref("logger")
    }
})

var client = c.getInstance("client")
print(client)
var client2 = c.getInstance("client2")
print(client2)
