import React from "react";

export default class Workspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list : this.props.currentList,
            editActive : false,
            editItemNum : "item-0",
            dragTextStart: {index: 0, text: ""},
            dragTextEnd: {index: 0, text: ""},
        }
    }
    handleClick = (event) => {
        // HANDLE CLICKS
        this.handleToggleEdit(event);
    }
    handleItemUpdate = (event) => {
        // TODO: ADD TO TRANSACTION STACK -> SAVE ITEMS TO LOCAL STORAGE
        let len = "item-".length;
        let index = this.state.editItemNum.substring(len);
        this.props.currentList.items[index] = event.target.value;
        this.props.renameItemCallback(this.props.currentList);
        // console.log(this.props.currentList);
        this.handleToggleEdit(event);
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleItemUpdate(event);
            this.handleToggleEdit(event);
        }
    }
    handleToggleEdit = (event) => {
        event.stopPropagation();
        this.setState({
            editActive : !this.state.editActive,
            editItemNum : event.target.id,
        });
        // console.log(event.target.id);
    }
    handleDragStart = (event) => {
        // this.state.setState((prevState) => {
        //     dragTextStart: {index: event.}
        // })
        let initLoc = {index: event.target.id, text: event.target.innerText}
        this.setState(prevState => ({dragTextStart: initLoc}));
        console.log("DRAGGING START AT INDEX: " + event.target.id + " with VALUE: " + event.target.innerText);

    }
    handleDragOver = (event) => {
        event.preventDefault();
        this.setState(prevState => ({dragTextEnd: {index: event.target.id, text: event.target.innerText}}));
        event.target.classList.remove("top5-item");
        event.target.classList.add("top5-item-dragged-to");
    }
    handleDragLeave = (event) => {
        event.preventDefault();
        event.target.classList.remove("top5-item-dragged-to");
        event.target.classList.add("top5-item");
    }
    handleDragEnd = (event) => {
        event.preventDefault();
        console.log("DRAGGING ENDED AT INDEX: " + event.target.id + " with VALUE: " + event.target.innerText);
        this.setState(prevState => ({dragTextEnd: {index: event.target.id, text: event.target.innerText}}));
        event.target.classList.remove("top5-item-dragged-to");
        event.target.classList.add("top5-item");
        this.handleAfterEffects();
    }
    handleAfterEffects = () => {
        // SWAP THE ITEMS AND SAVE TO LOCAL STORAGE
        console.log(this.state.dragTextEnd["index"]);
        if (this.state.dragTextStart["index"] !== this.state.dragTextEnd["index"])
        {
            let lenItem = "item-".length;
            let oldIndex = Number(this.state.dragTextStart["index"].substring(lenItem));
            let newIndex = Number(this.state.dragTextEnd["index"].substring(lenItem));
            this.props.moveItemCallback(oldIndex, newIndex);
        }
    }
    render() {
        const {
            currentList,
            // renameItemCallback,
        } = this.props;
        if (currentList != null) {
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                        <div id="edit-items">
                            {
                                currentList.items.map((item, id) => (
                                    <div id={"item-" + id} onClick={this.handleClick} className="top5-item" draggable={!this.state.editActive} onDragStart={this.handleDragStart} onDragOver={this.handleDragOver} onDrop={this.handleDragEnd} onDragLeave={this.handleDragLeave}>
                                        {
                                            (this.state.editActive && this.state.editItemNum === "item-" + id) ? 
                                            <input type="text" id={"item-text-input-" + id} 
                                            onClick={(e) => e.stopPropagation()} 
                                            onKeyPress={this.handleKeyPress}
                                            onBlur={this.handleItemUpdate}
                                            defaultValue={item} /> 
                                            : item
                                        }
                                        </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}