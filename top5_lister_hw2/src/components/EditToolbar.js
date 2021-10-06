import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { closeCallback, undoCallback, redoCallback } = this.props;
        return (
            <div id="edit-toolbar">
                <div 
                    id='undo-button' 
                    className="top5-button-disabled"
                    onClick={undoCallback}
                    disabled
                    >
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    className="top5-button-disabled"
                    onClick={redoCallback}
                    disabled
                    >
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    className="top5-button-disabled"
                    onClick={closeCallback}
                    disabled
                    >
                        &#x24E7;
                </div>
            </div>
        )
    }
}