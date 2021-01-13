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
        let index = lists[listId]['listItems'].findIndex((task) => {
            return task['id'] === taskId
        })
        lists[listId]['listItems'].splice(index, 1)
        storeList()
        setTimeout(this.props.refresh(), 1000)
    }

    taskContentChanged = (event) => {
        let listId = event.target.parentNode.parentNode.parentNode.id
        let taskId = event.target.parentNode.id
        let newTaskContent = event.target.innerText
        //console.log(listId + ' ' + taskId + ' ' + newTaskContent)
        let index = lists[listId]['listItems'].findIndex((task) => {
            return task['id'] === taskId
        })
        lists[listId]['listItems'][index]['taskContent'] = newTaskContent
    }

    render = () => {

        return(
            <Draggable draggableId={this.props.task['id']} index={this.props.index}>
            {(provided) => {
                return(
                    <div class="taskCard" 
                        id={this.props.task['id']}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <p 
                            class="taskCardContent"
                            contentEditable = "true"
                            onInput={this.taskContentChanged}
                            onKeyDown={this.props.keyPress}
                        >
                        {this.props.task['taskContent']}
                        </p>
                        <img class="icon deleteTaskIcon" src="./assets/cancel-circle.svg" alt="Delete Task" onClick={this.deleteTaskClicked}/>
                    </div>
                )
            }}
            </Draggable>
        )
    }
}

class List extends React.Component {

    addTaskClicked = (event) => {
        let listId = event.target.parentNode.parentNode.id
        let newTaskId = Math.random().toString(36).substring(2, 15)
        let newTaskContent = document.querySelector('#' + listId).childNodes[2].childNodes[0].value
        if(newTaskContent && newTaskContent != ''){
            lists[listId]['listItems'].push({
                'id': newTaskId,
                'taskContent': newTaskContent
            })
        }
        storeList()
        document.querySelector('#' + listId).childNodes[2].childNodes[0].value = ''
        setTimeout(this.props.refresh(), 2000)
    }

    deleteListClicked = (event) => {
        let listId = event.target.parentNode.parentNode.id
        lists[listId] = undefined
        storeList()
        setTimeout(this.props.refresh(), 2000)
    }

    keyPress = (event) => {
        if(event.key === 'Enter' || event.key === 'Escape'){
            event.preventDefault()
            event.stopPropagation()
            storeList()
            this.props.refresh()
            event.target.blur()
        }
    }

    titleTextChanged = (event) => {
        let listId = event.target.parentNode.parentNode.id
        let newListName = event.target.innerText
        lists[listId]['listName'] = newListName
    }

    render = () => {
        return(
            <div class="listContainer" id={this.props.list['id']}>
                <div class="listHeader">
                    <h4 class="listName" 
                        contentEditable="true" 
                        onInput={this.titleTextChanged}
                        onKeyDown = {this.keyPress}
                    >
                        {this.props.list['listName']}
                    </h4>
                    <img class="icon deleteListIcon" src="./assets/cancel-circle.svg" alt="Delete List" onClick={this.deleteListClicked}/>
                </div>
                <Droppable droppableId={this.props.list['id']}>
                {
                    (provided) => {
                        return(
                        <div class="taskList" {...provided.droppableProps} ref={provided.innerRef}>
                            {Object.values(this.props.list['listItems']).map((listItem, index) =>{
                                if(listItem){
                                    return <Task 
                                            id={listItem['id']} 
                                            task={listItem} 
                                            refresh = {this.props.refresh}
                                            index={index}
                                            keyPress={this.keyPress}
                                        />
                                }
                            })}
                            {provided.placeholder}
                        </div>
                        )
                    }
                }
                
                </Droppable>
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

    onDragEnd = (result) => {
        console.log(result)
        // Todo : Reorder Column
        if(result.reason === "DROP"){
            let originListId = result.source.droppableId
            let originIndex = result.source.index
            if(!result.destination){
                console.log('crap')
                storeList()
                this.refreshApp()
                return
            }else{
                let destinationListId = result.destination.droppableId
                let destinationIndex = result.destination.index

                let movedTask = lists[originListId]['listItems'][originIndex]
                console.log(movedTask)

                if(destinationListId != originListId){
                    lists[destinationListId]['listItems'].splice(destinationIndex, 0, movedTask)
                    lists[originListId]['listItems'].splice(originIndex, 1)
                }else{
                    lists[originListId]['listItems'].splice(destinationIndex, 0, lists[originListId]['listItems'].splice(originIndex, 1)[0]);
                }

                console.log(lists)
                
                storeList()
                this.refreshApp()
            }
            
        }

    }

    createList = () => {
        let newListId = Math.random().toString(36).substring(2, 15)
        let newList = {
            "id": newListId,
            "listName": "New List",
            "listItems": [

            ]
        }
        lists[newListId] = newList
        storeList()
        window.setTimeout(editableItems(), 2000)
        this.refreshApp()
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
                <DragDropContext
                    onDragEnd={this.onDragEnd}
                >
                    {Object.values(this.state.appLists).map((list) => {
                        return <List list={list} refresh={this.refreshApp}/>
                    })}
                </DragDropContext>
                <img 
                    class="icon addTaskIcon"
                    src="./assets/plus.svg"
                    alt="Add Task"
                    onClick={this.createList}
                />
                </div>
            )
    }
}

let startUp = () => {

    if(localStorage.getItem('listStore') && !['undefined', 'null'].includes(localStorage.getItem('listStore'))){
        lists = JSON.parse(localStorage.getItem('listStore'))
    }else{
        console.log('Creating List in Storage')
        lists = {}
        let list1 = {
            "id" : "y0zitt47gfb",
            "listName": "Today",
            "listItems" : [
                {"id" : "v0zigt47whc", "taskContent" : "Buy Milk"},
                {"id" : "b0zi5t4rwhc", "taskContent" : "Take out the Garbage"}
            ]
        }
        let list2 = {
            "id" : "f0ziqq7gfn",
            "listName": "This Week",
            "listItems" : [
                {"id" : "fk8vs85v0wh", "taskContent" : "Visit Bob"},
            ]
        }
        lists['y0zitt47gfb'] = list1
        lists['f0ziqq7gfn'] = list2
        storeList()
    }

    ReactDOM.render(<App />, document.querySelector('body'))
    editableItems()
}

startUp()



