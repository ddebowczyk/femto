package femto

/**
 * Interface that Femto container implements
 */
interface IContainer {
  /**
   * Adds component definition to container
   */
  function def(component : Component)

  /**
   * Shortcut for creating dependency to existing component by name
   */
  function ref(name : String) : ComponentRef

  /**
   * Instantiates component for given name
   */
  function getInstance(name : String) : Object
}
