from flask import Flask , request  , jsonify
from flask_cors import CORS
import json


app = Flask(__name__)
CORS(app)



TASK_FILE='tasks.json'

def load_tasks():
    with open(TASK_FILE, 'r') as file:
        return json.load(file)

def save_task(tasks):
    with open(TASK_FILE , 'w') as file :
        json.dump(tasks, file, indent=4)
        file.flush()
    


@app.route('/Tasks', methods=['GET'])
def get_tasks():
    email = request.args.get('email')  
    data = load_tasks()
    all_tasks = data.get('Tasks', [])

    if email:
        
        user_tasks = [task for task in all_tasks if task.get('email') == email]
        return jsonify({'Tasks': user_tasks}), 200  
    else:
        return jsonify({'Tasks': all_tasks}), 200


@app.route('/Users', methods=['GET'])
def fetch_users():
    data = load_tasks()
    return jsonify(data["Users"]), 200

@app.route('/Tasks/<string:taskId>', methods=['GET'])
def taskLoader(taskId):
    tasks = load_tasks()  
    filtered_tasks = [task for task in tasks['Tasks'] if task['id'] == taskId]
    
    if not filtered_tasks:
        return jsonify({'error': 'Task not found'}), 404

    return jsonify(filtered_tasks[0]), 200 


@app.route('/Tasks/<string:task_id>', methods=['POST'])
def addSubtask(task_id):
    new_subtask = request.json.get('subtask')
    tasks = load_tasks()
    updated_task = None
    for task in tasks['Tasks']:
        if task['id'] == task_id:
            task['subtasks'].append(new_subtask)
            updated_task = task
            break
    save_task(tasks)
    return jsonify(updated_task), 200 



@app.route('/Tasks/<string:task_id>', methods=['PATCH'])
def updateSubtasks(task_id):
    subtasks = request.json.get('subtasks')
    tasks = load_tasks()
    for task in tasks['Tasks']:
        if task['id'] == task_id:
            task['subtasks'] = subtasks
            break
    save_task(tasks)
    return jsonify(tasks), 200


@app.route('/Tasks/<string:task_id>', methods=['DELETE'])
def deleteSubTaskApp(task_id):
    subtask = request.json.get('subtask')  
    tasks = load_tasks()
    for task in tasks['Tasks']:  
        if task['id'] == task_id:
            if subtask:
                if subtask in task['subtasks']:
                    task['subtasks'].remove(subtask)
            else:
                pass
    
    if not subtask:
        tasks['Tasks'] = [task for task in tasks['Tasks'] if task['id'] != task_id]
        
    save_task(tasks)
    return jsonify(tasks), 200

@app.route('/Tasks' , methods=['POST'])
def addGlobalTaskApp() :
    newTask = request.json
    tasks = load_tasks()
    tasks['Tasks'].append(newTask)
    save_task(tasks)
    return jsonify(tasks), 201


@app.route('/Register', methods=['POST'])
def addUser():
    newUser = request.json
    if not newUser.get('name') or not newUser.get('email') or not newUser.get('password'):
        return jsonify({"error": "Please provide name, email, and password"}), 400

    try:
        users = load_tasks()
        if "Users" not in users:
            users["Users"] = []  # Ensure 'Users' key exists
        users['Users'].append(newUser)
        save_task(users)
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        print(f"Error saving user: {e}")
        return jsonify({"error": "Internal Server Error"}), 500



@app.route('/home' , methods=['DELETE'])
def deletedTaskId():
    taskId = request.json.get('taskId')
    tasks = load_tasks()
    tasks['Tasks'] = [task for task in tasks['Tasks'] if task['id'] != taskId ]
    save_task(tasks)
    return jsonify(tasks), 200


if __name__ == '__main__':
    app.run(debug=True)

