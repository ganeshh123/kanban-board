let {DragDropContext, Draggable, Droppable} = window.ReactBeautifulDnd

let lists = {}

let storeLists = () => {
    console.log('Writing Lists to Storage')
    console.log(lists)
    window.localStorage.setItem('listStore', JSON.stringify(lists))
    console.log('Set Correctly')
    lists = JSON.parse(localStorage.getItem('listStore'))
}

class Task extends React.Component {

    deleteTask = () => {
        let listId = this.props.listId
        let index = lists[listId]['tasks'].findIndex((task) => {
            return task['taskId'] == this.props.inputTask['taskId']
        })
        lists[this.props.listId]['tasks'].splice(index, 1)
        storeLists()
        this.props.refresh()
    }
    
    taskContentChanged = (event) => {
        let listId = this.props.listId
        console.log(listId)
        console.log(lists[listId])
        console.log(this.props.inputTask)
        let index = lists[listId]['tasks'].findIndex((task) => {
            return task['taskId'] == this.props.inputTask['taskId']
        })
        console.log(index)
        lists[listId]['tasks'][index]['taskDescription'] = event.target.innerText
    }


    keyPress = (event) => {
        if(event.key === 'Enter' && event.target.className == "taskCardContent"){
            storeLists()
            event.target.blur()
            this.props.refresh()
        }
    }


    render = () => {

        return(
            <Draggable draggableId={this.props.inputTask['taskId']} index={this.props.index}>
            {
            (provided) => {
                return(
                    <div class="taskCard" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} id={this.props.inputTask['id']}>
                        <p onKeyDown={this.keyPress} onInput={this.taskContentChanged} contentEditable="true" class="taskCardContent" > {this.props.inputTask['taskDescription']} </p>
                        <img onClick={this.deleteTask} class="deleteTaskIcon" src="/assets/delete.svg" alt="Delete Task" />
                    </div>
                )
            }
            }
            </Draggable>
        )
    }
}

class List extends React.Component {

    addTask = () => {
        let listId = this.props.inputList['listId']
        let newTaskInput = document.getElementById(listId + 'Input')
        if(newTaskInput.value != ''){
                    let newTask = {
                    taskId: Math.random().toString(36).substring(2, 15),
                    taskDescription: newTaskInput.value
                }
            lists[listId]['tasks'].push(newTask)
            storeLists()
          }
        newTaskInput.value = ''
        this.props.refresh()
    }

    deleteList = () => {
        let listId = this.props.inputList['listId']
        lists[listId] = undefined
        storeLists()
        this.props.refresh()
    }

    listNameChanged = (event) => {
        let listId = this.props.inputList['listId']
        lists[listId]['listName'] = event.target.innerText
    }
    
    keyPress = (event) => {
        if(event.target.className == "newListItemInput" && event.key == "Enter"){
            this.addTask()
        }
        if(event.target.className == "listName" && event.key == "Enter"){
            event.preventDefault()
            event.stopPropagation()
            event.target.blur()
            storeLists()
            this.props.refresh()
        }
    }

    render = () => {

       let list = this.props.inputList

        return(
            <div class="listContainer" id={this.props.id}>
                <div class="listHeader">
                <h4 onKeyDown={this.keyPress} onInput={this.listNameChanged} contentEditable="true" class="listName">{list['listName']} </h4>
                <img onClick={this.deleteList} class="deleteListIcon" src="/assets/delete.svg" alt="Delete List"/>
                </div>
                <Droppable droppableId={list['listId']}>
                {
                (provided) => {
                    return(
                        <div class="taskList" {...provided.droppableProps} ref={provided.innerRef}>
                        {Object.values(list['tasks']).map((task, index) =>{
                            return (
                                <Task index={index} inputTask={task} listId={list['listId']} refresh={this.props.refresh} />
                            )
                        })}
                        {provided.placeholder}
                        </div>
                    )
                }
                }
                </Droppable>
                <div class="newListItem">
                    <input onKeyDown={this.keyPress} id={list['listId'] + 'Input'} type="text" class="newListItemInput" placeholder="New Task ..." />
                    <img class="addTaskIcon" onClick={this.addTask} src="../assets/submit.svg" alt="Add Task"/>
                </div>
            </div>
        )
    }
}

class App extends React.Component{

    state = {
        appLists: lists
    }

    onDragEnd = (result) => {
        console.log(result)
        // Todo : Reorder Column
        if(result.reason === "DROP" && result.destination){
            let originListId = result.source.droppableId
            let originIndex = result.source.index
            let destinationListId = result.destination.droppableId
            let destinationIndex = result.destination.index
    
            let movedTask = lists[originListId]['tasks'][originIndex]
                    lists[originListId]['tasks'].splice(originIndex, 1)
                    lists[destinationListId]['tasks'].splice(destinationIndex, 0, movedTask);
        }
            storeLists()
        this.refreshApp()
    }

    createList = () => {
        let newListId = Math.random().toString(36).substring(2, 15)
        lists[newListId] = {
            "listId": newListId,
            "listName": "New List",
            "tasks": []
        }
        storeLists()
        this.refreshApp()
  }


    refreshApp = () => {
        console.log('Refreshing...')
        this.setState({
            appLists: lists
        })
    }

    render = () => {
            return(
                <div id="app">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    {Object.values(this.state.appLists).map((list) => {
                        return <List id={list['listId']} inputList={list} refresh={this.refreshApp}/>
                    })}
                </DragDropContext>
                <img src="/assets/plus.svg" class="addListIcon" alt="Add Task" onClick={this.createList} />
                </div>
            )
    }
}

let startUp = () => {

    if(localStorage.getItem('listStore') && !['undefined', 'null'].includes(localStorage.getItem('listStore'))){
        lists = JSON.parse(localStorage.getItem('listStore'))
    }else{
        console.log('Creating List in Storage')
        lists = {
            y0zitt47gfb: {
                listId: 'y0zitt47gfb',
                listName: 'Today',
                tasks: [
                    { taskId: 'v0zigt47whc', taskDescription: 'Buy Milk'},
                    { taskId: 'b0zi5t4rwhc', taskDescription: 'Take out the Garbage'}
                ]
            },
            f0ziqq7gfn: {
                listId: 'f0ziqq7gfn',
                listName: 'This Week',
                tasks: [
                    { taskId: 'fk8vs85v0wh', taskDescription: 'Visit Bob'}
                    ]
            }
        }
        storeLists()
    }

    ReactDOM.render(<App />, document.body)
}

startUp()
