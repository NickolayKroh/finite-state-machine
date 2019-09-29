const conf = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};

class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config)
            throw new Error();
        
        this.initial = config.initial;
        this.states = config.states;
        this.reset();
        this.history = [];
        this.canceled = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.stateActual;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(!this.states[state])
            throw new Error();
        
        this.history.push(this.stateActual);
        this.canceled = [];
        this.stateActual = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let newState = this.states[this.stateActual].transitions[event];

        if(!this.states[newState])
            throw new Error();

        this.changeState(newState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.stateActual = this.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if(!event)
            return Object.keys(this.states);
        
        let result = [];
        
        for(let i = 0; i < Object.values(this.states).length; ++i)
            if(event in Object.values(this.states)[i].transitions)
                result.push( Object.keys(this.states)[i] );
        
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(!this.history.length)
            return false;
        
        let state = this.history.pop();
        this.canceled.push(this.getState());
        this.stateActual = state;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(!this.canceled.length)
            return false;
        
        let state = this.canceled.pop();
        this.history.push(state);
        this.stateActual = state;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.canceled = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
