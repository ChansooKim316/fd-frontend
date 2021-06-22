import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';


const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
    constructor(props) {
        super(props);
        // 'div' will wrap the child elemnets
        this.el = document.createElement('div')
    }
    // append child elements to the modalRoot
    // a portal element in react inserts into the DOM tree after the modal's children are mounting.
    componentDidMount() {
        modalRoot.appendChild(this.el)
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el)
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el)
    }
}

export default Modal