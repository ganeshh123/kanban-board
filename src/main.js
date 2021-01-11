let React = window.React
let ReactDOM = window.ReactDOM
let {DragDropContext, Draggable, Droppable } = window.ReactBeautifulDnd;

let lists = {}

let storeList = () => {
    console.log('Writing Updated Lists to Storage')
    console.log(lists)
    console.log('List Storage Updated ')
    window.localStorage.setItem('listStore', JSON.stringify(lists))
    console.log('Set Correctly')
    lists = JSON.parse(localStorage.getItem('listStore'))
}

class Task extends React.Component {

    deleteTaskClicked = (event) => {
        let taskId = event.target.parentNode.id
        let listId = event.target.parentNode.parentNode.parentNode.id
        lists[listId]['listItems'][taskId] = undefined
        storeList()
        setTimeout(this.props.refresh(), 1000)
    }

    render = () => {

        return(
            <div class="taskCard" id={this.props.task['id']}>
                <p class="taskCardContent">
                   {this.props.task['taskContent']}
                </p>
                <img class="icon deleteTaskIcon" src="./assets/cancel-circle.svg" alt="Delete Task" onClick={this.deleteTaskClicked}/>
            </div>
        )
    }
}

class List extends React.Component {

    addTaskClicked = (event) => {
        let listId = event.target.parentNode.parentNode.id
        let newTaskId = Math.random().toString(36).substring(2, 15)
        let newTaskContent = document.querySelector('#' + listId).childNodes[2].childNodes[0].value
        if(newTaskContent && newTaskContent != ''){
            lists[listId]['listItems'][newTaskId] = {
                'id': newTaskId,
                'taskContent': newTaskContent
            }
        }
        storeList()
        document.querySelector('#' + listId).childNodes[2].childNodes[0].value = ''
        setTimeout(this.props.refresh(), 2000)
    }

    keyPress = (event) => {
        if(event.key === 'Enter'){
            event.preventDefault()
            event.stopPropagation()
            this.addTaskClicked(event)
        }
    }

    render = () => {
        return(
            <div class="listContainer" id={this.props.list['id']}>
                <h4 class="listName">{this.props.list['listName']}</h4>
                <div id="taskList">
                    {Object.values(this.props.list['listItems']).map((listItem) =>{
                        if(listItem){
                            return <Task 
                                    id={listItem['id']} 
                                    task={listItem} 
                                    refresh = {this.props.refresh}
                                />
                        }
                    })}
                </div>
                <div class="newListItem">
                    <input 
                        type="text"
                        class="newListItemInput"
                        placeholder="New Task ..." 
                        onKeyDown = {this.keyPress}
                    />
                    <img 
                        class="icon addTaskIcon"
                        src="./assets/plus.svg"
                        alt="Add Task"
                        onClick={this.addTaskClicked}
                    />
                </div>
            </div>
        )
    }
}

class App extends React.Component{

    state = {
        appLists: lists
    }

    refreshApp = () => {
        console.log('Refreshing...')
        this.setState({
            appLists: lists
        })
        editableItems()
    }

    render = () => {
            return(
                <div id="app">
                    {Object.values(this.state.appLists).map((list) => {
                        return <List list={list} refresh={this.refreshApp}/>
                    })}
                </div>
            )
    }
}

let editableItems = () => {
    /* Editable List Name */
    let allListNameDOM = document.querySelectorAll('.listName')
    allListNameDOM.forEach((listNameDOM) => {
        listNameDOM.contentEditable = true
        listNameDOM.addEventListener('keyup', (event) => {
            if(event.which == 13 && document.activeElement == listNameDOM){
                event.preventDefault()
                event.stopPropagation()
                let listId = event.target.parentNode.id
                let newListName = event.target.innerText
                newListName = newListName.replace(/\n/g, '')
                lists[listId]['listName'] = newListName
                storeList()
                listNameDOM.blur()
                ReactDOM.render(<App />, document.querySelector('body'))
            }
        })
    })

    /* Editable List Items */
    let allTaskCardContentDOM = document.querySelectorAll('.taskCardContent')
    allTaskCardContentDOM.forEach((taskCardContentDOM) => {
        taskCardContentDOM.contentEditable = true
        taskCardContentDOM.addEventListener('keyup', (event) => {
            if(event.which == 13 && document.activeElement == taskCardContentDOM){
                event.preventDefault()
                event.stopPropagation()
                let taskId = event.target.parentNode.id
                let listId = event.target.parentNode.parentNode.parentNode.id
                let newTaskName = event.target.innerText
                newTaskName = newTaskName.replace(/\n/g, '')
                console.log(newTaskName)
                lists[listId]['listItems'][taskId]['taskContent'] = newTaskName
                storeList()
                taskCardContentDOM.blur()
                ReactDOM.render(<App />, document.querySelector('body'))
            }
        })
    })

}

let startUp = () => {

    if(localStorage.getItem('listStore') && !['undefined', 'null'].includes(localStorage.getItem('listStore'))){
        lists = JSON.parse(localStorage.getItem('listStore'))
    }else{
        console.log('Creating List in Storage')
        lists = {}
        let list1 = {
            "id" : "y0zitt47gfb",
            "listName": "To Do",
            "listItems" : {
                "v0zigt47whc": {"id" : "v0zigt47whc", "taskContent" : "Buy Milk"},
                "b0zi5t4rwhc" : {"id" : "b0zi5t4rwhc", "taskContent" : "Work Out"}
            }
        }
        lists['y0zitt47gfb'] = list1
        storeList()
    }

    ReactDOM.render(<App />, document.querySelector('body'))
    editableItems()
}

startUp()


