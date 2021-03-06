import AbstractCommand from './command/AbstractCommand'
import FetchCommand from './command/FetchCommand'
import StatusCommand from './command/StatusCommand'
import HashCommand from './command/HashCommand'

class Command extends AbstractCommand {
  /**
   * Main Universal Command
   * @param {String} action - Action for the command
   * @param {Object} params - Command parameters
   * @augments AbstractCommand
   * @constructs Command
   * @returns {Proxy}
   */
  constructor (action, params) {
    super(action, params)
    const CommandClass = this.class
    this.instance = new CommandClass(this.params)
    if (!this.instance) {
      throw new TypeError('Action not found')
    }
    return new Proxy(this, {
      get (target, name) {
        if (['run', 'instance', 'class'].includes(name)) return target[name]
        else if (typeof name === 'string' && name.startsWith('get')) {
          return (...args) => {
            return target.instance[name](...args)
          }
        } else return target.instance[name]
      }
    })
  }

  /**
   * Get Class by action name
   * @param {Boolean|String} [action=false]
   * @static
   * @member Command#getClass
   * @throws ReferenceError
   * @returns {FetchCommand|StatusCommand|HashCommand}
   */
  static getClass (action = false) {
    if (!action) throw new ReferenceError('Action param empty')
    switch (action) {
      case 'fetch':
        return FetchCommand
      case 'status':
        return StatusCommand
      case 'hash':
        return HashCommand
      default:
        throw new ReferenceError('Action not found')
    }
  }

  /**
   * Get class of this command
   * @see {@link Command#getClass}
   * @readonly
   * @member Command#class
   */
  get class () {
    const action = this._map.get(this).action
    return Command.getClass(action)
  }

  /**
   * Run command
   * @param {Object} params - Parameters for command running
   * @member Command#run
   */
  run (params) {
    if (this.instance) return this.instance.run(params)
  }
}

export default Command
