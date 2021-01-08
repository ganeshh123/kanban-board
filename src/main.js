let React = window.React
let ReactDOM = window.ReactDOM
let {DragDropContext, Draggable, Droppable } = window.ReactBeautifulDnd;

//console.log(Math.random().toString(36).substring(2, 15))

let list1 = [
    {"id" : "v0zigt47whc", "taskContent" : "Buy Milk"},
    {"id" : "b0zi5t4rwhc", "taskContent" : "Work Out"}
]


class Task extends React.Component {

    render = () => {

        return(
            <div class="taskCard">
                <p class="taskCardContent">
                   {this.props.task['taskContent']}
                </p>
                <img class="icon" src="./assets/cancel-circle.svg" alt="Delete Task"></img>
            </div>
        )
    }
}

class List extends React.Component {

    render = () => {
        return(
            <div id="listContainer">
                <div id="taskList">
                    {this.props.list.map((listItem, index) => {
                        return <Task id={listItem['id']} task={listItem} />
                    })}
                </div>
                <div id="newListItem">

                </div>
            </div>
        )
    }
}


ReactDOM.render(<List list={list1} />, document.querySelector('body'))