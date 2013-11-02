package femto

uses java.util.List
uses java.util.HashMap
uses java.util.ArrayList
uses java.lang.Exception
uses gw.lang.reflect.IConstructorHandler
uses gw.lang.reflect.IType

/**
 * Femto container implementation
 */
class Container implements IContainer {
  var _definitions = new HashMap<String, Component>()
  var _instances = new HashMap<String, Object>()

  construct() {
    log("New container")
  }

  override function def(component : Component) {
    if(_definitions.containsKey(component.Name)) {
      throw new Exception("Component name ${component.Name} already in use.")
    }
    log("Adding definition of component ${component.Name} : ${component.Type}")
    _definitions.put(component.Name, component)
  }

  override function ref(name : String) : ComponentRef {
    log("Adding reference to component ${name}")
    return new ComponentRef(name)
  }

  override function getInstance(name : String) : Object {
    log("Retrieving instance of component ${name}")
    return recursivelyGetInstance(new ArrayList<String>(), name)
  }

  private function recursivelyGetInstance(visited: List<String>, name: String) : Object {
    log("Internal retrieval of component ${name} instance")

    if(!_instances.containsKey(name)) {
      log("===> No instance of component ${name} exists yet - instantiating...")
      createAndInitialize(visited, name)
    }

    return _instances.get(name)
  }

  private function createAndInitialize(visited: List<String>, name: String) {
    // dependency cycle detection
    if (visited.contains(name)) {
      var resolved = visited.join(", ")
      log("Cyclic reference to component ${name} found for component ${name} - components resolved so far: ${resolved}")
      throw new Exception("Cycle detected for component ${name}")
    }
    visited.add(name)

    if (not _definitions.containsKey(name)) {
      throw new Exception("Component name ${name} not found.")
    }

    var component = _definitions.get(name)
    var object = createInstance(visited, component)

    _instances.put(name, object)
  }

  private function createInstance(visited : List<String>, component : Component) : Object {
    var cArgs = getConstructorArguments(visited, component)
    var constructor = findConstructor(component.Type, cArgs)
    return initializeProperties(visited, component, constructor.newInstance(cArgs))
  }

  private function initializeProperties(visited : List<String>, component : Component, object : Object) : Object {
    // set properties
    var properties = component.Properties
    if (properties != null) {
      log("Properties to initialize found")
      for (propFRef in properties.Keys) {
        if (!propFRef.PropertyInfo.isWritable()) {
          throw new Exception("Property ${propFRef.PropertyInfo.Name} of ${component.Name} : ${typeof object} is not writable")
        }

        log("Initializing property ${propFRef.PropertyInfo.Name} of ${component.Type}")
        var arg = component.Properties.get(propFRef)
        var value = getReferredValue(visited, arg)

        log("Setting property ${propFRef.PropertyInfo.Name} of ${component.Name} : ${typeof object} to ${value}")
        propFRef.PropertyInfo.Accessor.setValue(object, value)
      }
    }
    return object
  }

  private function getReferredValue(visited : List<String>, arg : Object) : Object {
    var value : Object
    if (arg typeis ComponentRef) {
      log("Referred value initialized with reference to component ${arg.Name}")
      value = recursivelyGetInstance(visited, arg.Name)
    } else {
      log("Referred value returned ${arg}")
      value = arg
    }
    return value
  }

  private function getConstructorArguments(visited : List<String>, component : Component) : Object[] {
    var args = new ArrayList<Object>()
    for (arg in component.CArgs) {
      args.add(getReferredValue(visited, arg))
    }
    return args.toArray()
  }

  private function findConstructor(type : IType, args : Object[]) : IConstructorHandler {
    var types = args.map<IType>(\arg -> typeof arg)
    log("Looking for constructor of ${type} with args: ${args}")
    var constructor = type.TypeInfo.getConstructor(types)
    if (constructor == null) {
      var listOfTypes = types.join(", ")
      throw new Exception("No constructor found ${type}(${listOfTypes})")
    }
    return constructor.Constructor
  }

  private function log(m : String) {
    print("[${typeof this}] ${m}")
  }
}
