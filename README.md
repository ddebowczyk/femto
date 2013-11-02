Femto
=====

Tiny IoC container, makes it easier to manage dependencies in your Gosu app

Features
--------
 - makes wiring of Gosu scripts cleaner
 - cyclic dependency detection
 - some type safety (see below)
 - useful for small standalone Gosu apps / scripts
 - er, (probably) not thread safe (yet)

How to use
----------
No JAR yet, so you have to drop sources somewhere into your Gosu classpath.

Simple example is attached in the /test directory, but just for convenience:

### Logger.gs
```gosu
package sample

class Logger {
  var _mode : String as Mode

  construct(path : String) {
    print("Constructed Logger")
  }
}
```

### Api.gs
```gosu
package sample

class Api {
  var _logger : Logger as Logger

  construct() {
    print("Constructed API - empty constructor")
  }

  construct(url : String, username : String, password : String) {
    print("Constructed API - full constructor")
  }
} 
```

### Client.gs
```gosu
package sample

class Client {
  var _logger : Logger as Logger

  construct(api : Api) {
    print("Constructed Client")
  }
} 
```

### test.gs
```gosu
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
```
