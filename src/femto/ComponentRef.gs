package femto

/**
 * Represents reference to Femto component
 */
class ComponentRef {
  var _name : String as readonly Name

  construct(name : String) {
    log("New reference to component ${name}")
    _name = name
  }

  private function log(m : String) {
    print("[${typeof this}] ${m}")
  }
}
