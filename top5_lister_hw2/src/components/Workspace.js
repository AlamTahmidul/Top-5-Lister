import React from "react";

export default class Workspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list : this.props.currentList,
            editActive : false,
            editItemNum : "item-0",
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
        console.log(this.props.currentList);
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
                                    <div id={"item-" + id} onClick={this.handleClick} className="top5-item" draggable={!this.state.editActive}>
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