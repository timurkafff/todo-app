import { Task } from "../stores/TaskStore";

const API_URL = "https://back-todo-study.onrender.com/api/tasks";

/**
 * Получает список невыполненных задач с сервера.
 * 
 * @async
 * @returns {Promise<Task[]>} Промис, который разрешается массивом невыполненных задач.
 */
export const fetchRunningTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_URL}/not-completed`);
    if (!response.ok) return [];
    return response.json();
};

/**
 * Получает список завершенных задач с сервера.
 * 
 * @async
 * @returns {Promise<Task[]>} Промис, который разрешается массивом завершенных задач.
 */
export const fetchCompletedTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_URL}/completed`);
    if (!response.ok) return [];
    return response.json();
};

/**
 * Получает список всех задач с сервера.
 * 
 * @async
 * @returns {Promise<Task[]>} Промис, который разрешается массивом всех задач.
 */
export const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) return [];
    return response.json();
};

/**
 * Отправляет запрос на сервер для добавления новой задачи.
 * 
 * @async
 * @param {Omit<Task, "id" | "completed" | "createdAt" | "deleted" | "order">} task - Данные новой задачи без автоматически генерируемых полей.
 * @returns {Promise<Task>} Промис, который разрешается с созданной задачей.
 * @throws {Error} Если запрос завершился с ошибкой.
 */
export const addTask = async (task: Omit<Task, "id" | "completed" | "createdAt" | "deleted" | "order">): Promise<Task> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Failed to add task");
    return response.json();
};

/**
 * Отправляет запрос на сервер для обновления задачи.
 * 
 * @async
 * @param {string} id - Идентификатор задачи.
 * @param {Partial<Task>} updates - Обновленные данные задачи.
 * @returns {Promise<Task>} Промис, который разрешается с обновленной задачей.
 * @throws {Error} Если запрос завершился с ошибкой.
 */
export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
};

/**
 * Отправляет запрос на сервер для обновления статуса задачи.
 * 
 * @async
 * @param {string} id - Идентификатор задачи.
 * @param {Object} updates - Обновления статуса задачи.
 * @param {boolean} updates.completed - Новый статус задачи.
 * @param {string} [updates.endDate] - Дата завершения задачи (если применимо).
 * @returns {Promise<Task>} Промис, который разрешается с обновленной задачей.
 * @throws {Error} Если запрос завершился с ошибкой.
 */
export const updateTaskStatus = async (id: string, updates: { completed: boolean; endDate?: string }): Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update task status");
    return response.json();
};

/**
 * Отправляет запрос на сервер для удаления задачи.
 * 
 * @async
 * @param {string} id - Идентификатор задачи.
 * @returns {Promise<void>} Промис, который разрешается после успешного удаления задачи.
 * @throws {Error} Если запрос завершился с ошибкой.
 */
export const deleteTask = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
};