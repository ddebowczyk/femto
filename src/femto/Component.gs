package femto

uses gw.lang.reflect.features.IFeatureReference
uses gw.lang.reflect.features.IPropertyReference
uses java.util.Map
uses gw.lang.reflect.IType
uses java.lang.Exception

/**
 * Represents component in Femto configuration
 */
class Component<T> {
  var _name : String as readonly Name
  var _type : IType as readonly Type
  var _constructor : IFeatureReference as Constructor
  var _constructArgs : List<Object> as CArgs
  var _properties : Map<IPropertyReference<T, Object>, Object> as Properties

  construct(name : String) {
    log("New component definition ${name}")
    var type = (typeof this).TypeParameters.first()
    if (type == Object) {
      throw new Exception("Type parameter of component not declared - please use Component<YOUR TYPE> to define type for component")
    }
    log("Type of component is ${type}")
    _name = name
    _type = type
  }

  private function log(m : String) {
    print("[${typeof this}] ${m}")
  }
}
