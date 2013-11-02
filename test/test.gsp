classpath "../src,../test"

uses femto.Container
uses femto.Component

uses sample.Logger
uses sample.Api
uses sample.Client

// create container instance
var c = new Container()

// setup Logger 
c.def(new Component<Logger>("logger"){
  :CArgs = {
    "c:/tmp/log.txt"
  },
  :Properties = {
    Logger#Mode -> "debug"
  }
})

// setup Api
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

// setup Client (first instance)
c.def(new Component<Client>("client1"){
  :CArgs = {
    c.ref("api")
  },
  :Properties = {
    Client#Logger -> c.ref("logger")
  }
})

// setup Client (second instance)
c.def(new Component<Client>("client2"){
    :CArgs = {
        c.ref("api")
    },
    :Properties = {
        Client#Logger -> c.ref("logger")
    }
})

// ...at this point none of the wired objects is yet instantiated

// get instance of client #1
var client = c.getInstance("client1")
// ...all dependencies of "client1" were instantiated
print(client)

// get instance of client #2
var client2 = c.getInstance("client2")
// ...all dependencies of "client2" were instantiated, shares references to Api and Logger with "client1"
print(client2)
