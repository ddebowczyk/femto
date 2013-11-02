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
