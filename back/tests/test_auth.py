import pytest
from app import app

# Fixture to set up the test client
@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'testsecretkey'
    with app.test_client() as client:
        yield client

# Fixture to clear data between tests
@pytest.fixture(autouse=True)
def clear_data(client):
    # Before each test, clear any relevant test data
    # This is a placeholder for the actual clearing logic.
    client.post('/clear')  # Example route that clears test data, if implemented
    yield
    # After the test, you can do any additional cleanup if necessary (if any)

# Test to register a user
def test_register(client):
    response = client.post('/Register', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': '123456'
    })
    assert response.status_code == 201
    assert response.get_json()['message'] == 'User registered successfully'

# Test to check that incomplete registration information is not allowed
def test_register_missing_fields(client):
    response = client.post('/Register', json={
        'name': 'Test User',
        'email': ''
    })
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Please provide name, email, and password'

# Test to get tasks of a user (requires a previously registered user)
def test_get_user_tasks(client):
    # First, register a user
    client.post('/Register', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': '123456'
    })

    # Add a task for this user
    client.post('/Tasks', json={
        'email': 'test@example.com',
        'task_name': 'Test Task',
        'subtasks': [],
        'id': 'task1'
    })

    # Test route to get the user's tasks
    response = client.get('/Tasks?email=test@example.com')
    assert response.status_code == 200
    tasks = response.get_json()['Tasks']
    
    # Assert that only one task is returned
    assert len(tasks) == 1

# Test to add a subtask to a task
def test_add_subtask(client):
    # Add a task first
    client.post('/Tasks', json={
        'email': 'test@example.com',
        'task_name': 'Test Task',
        'subtasks': [],
        'id': 'task1'
    })

    # Add a subtask to this task
    response = client.post('/Tasks/task1', json={'subtask': 'Test Subtask'})  # Corrected endpoint
    assert response.status_code == 200

# Test to update subtasks
def test_update_subtasks(client):
    # Add a task first
    client.post('/Tasks', json={
        'email': 'test@example.com',
        'task_name': 'Test Task',
        'subtasks': ['Old Subtask'],
        'id': 'task1'
    })

    # Update the subtasks
    response = client.patch('/Tasks/task1', json={'subtasks': ['Updated Subtask']})  # Corrected endpoint        
    assert response.status_code == 200

# Test to delete a subtask
def test_delete_subtask(client):
    # Add a task with a subtask
    client.post('/Tasks', json={
        'email': 'test@example.com',
        'task_name': 'Test Task',
        'subtasks': ['Test Subtask'],
        'id': 'task1'
    })

    # Delete the subtask
    response = client.delete('/Tasks/task1', json={'subtask': 'Test Subtask'})  # Corrected endpoint
    assert response.status_code == 200

# Test to delete a task
def test_delete_task(client):
    # Add a task first
    client.post('/Tasks', json={
        'email': 'test@example.com',
        'task_name': 'Test Task',
        'subtasks': [],
        'id': 'task1'
    })

    # Delete the task
    response = client.delete('/Tasks/task1', json={})  # Send an empty JSON body
    assert response.status_code == 200
