let React = window.React
let ReactDOM = window.ReactDOM
let {DragDropContext, Draggable, Droppable } = window.ReactBeautifulDnd;

class Task extends React.Component {


    render = () => {
        let task = this.props.task
        
        return(
            <div class="taskCard">
                <p class="taskCardContent">
                    Buy Milk at the store
                </p>
                <img class="icon" src="./assets/cancel-circle.svg" alt="Delete Task"></img>
            </div>
        )
    }
}


ReactDOM.render(<Task />, document.querySelector('body'))