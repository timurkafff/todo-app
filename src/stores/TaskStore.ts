import { makeAutoObservable, action, runInAction } from "mobx";
import { fetchRunningTasks, fetchCompletedTasks, addTask, deleteTask, updateTask, updateTaskStatus } from "../api/api";

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;
    startDate?: string;
    endDate?: string;
    priority?: string;
    deleted: boolean;
    order: number;
}

class TaskStore {
    runningTasks: Task[] = [];
    completedTasks: Task[] = [];
    isLoading: boolean = false;
    searchQuery: string = "";

    constructor() {
        makeAutoObservable(this, {
            loadTasks: action.bound,
            addTask: action.bound,
            updateTask: action.bound,
            deleteTask: action.bound,
            searchTasks: action.bound,
        });
    }
    /**
     * Загружает задачи из API и обновляет состояние хранилища.
     * Выполняет параллельные запросы для получения невыполненных и завершенных задач.
     * В случае ошибки очищает списки задач и сбрасывает состояние загрузки.
     * @async
     * @returns {Promise<void>} Промис, который разрешается после завершения загрузки.
    */
    async loadTasks() {
        this.isLoading = true;
        try {
            const [running, completed] = await Promise.all([
                fetchRunningTasks(),
                fetchCompletedTasks(),
            ]);
            runInAction(() => {
                this.runningTasks = running;
                this.completedTasks = completed;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.runningTasks = [];
                this.completedTasks = [];
                this.isLoading = false;
            });
        }
    }


    /**
     * Добавляет новую задачу в хранилище.
     * Выполняет запрос к API для создания задачи, а затем обновляет локальное состояние.
     * Если задача завершена, она добавляется в список завершенных задач, иначе — в список активных задач.
     * 
     * @async
     * @param {Omit<Task, "id" | "completed" | "createdAt" | "deleted" | "order">} task - Данные новой задачи без автоматически генерируемых полей.
     * @returns {Promise<Task>} Промис, который разрешается с созданной задачей.
    */
    async addTask(task: Omit<Task, "id" | "completed" | "createdAt" | "deleted" | "order">) {
        const newTask = await addTask(task);
        runInAction(() => {
            if (!newTask.completed) this.runningTasks.push(newTask);
            else this.completedTasks.push(newTask);
        });
        return newTask;
    }

    async deleteTask(id: string) {
        await deleteTask(id);
        runInAction(() => {
            this.runningTasks = this.runningTasks.filter((task) => task.id !== id);
            this.completedTasks = this.completedTasks.filter((task) => task.id !== id);
        });
    }

    /**
     * Обновляет статус задачи (выполнена/невыполнена) и перемещает её между списками.
     * Если задача становится завершенной, добавляет дату завершения.
     * @async
     * @param {string} id - Идентификатор задачи.
     * @param {Object} updates - Обновления статуса задачи.
     * @param {boolean} updates.completed - Новый статус задачи.
     * @param {string} [updates.endDate] - Дата завершения задачи (если применимо).
     * @returns {Promise<Task>} Обновленная задача.
    */
    async updateTask(id: string, updates: Partial<Task>) {
        const updatedTask = await updateTask(id, updates);
        runInAction(() => {
            const runningIndex = this.runningTasks.findIndex((task) => task.id === id);
            const completedIndex = this.completedTasks.findIndex((task) => task.id === id);
            if (runningIndex !== -1) this.runningTasks[runningIndex] = updatedTask;
            else if (completedIndex !== -1) this.completedTasks[completedIndex] = updatedTask;
        });
        return updatedTask;
    }

    /**
     * Обновляет статус задачи (выполнена/невыполнена) и перемещает её между списками.
     * Если задача становится завершенной, добавляет дату завершения.
     * @async
     * @param {string} id - Идентификатор задачи.
     * @param {Object} updates - Обновления статуса задачи.
     * @param {boolean} updates.completed - Новый статус задачи.
     * @param {string} [updates.endDate] - Дата завершения задачи (если применимо).
     * @returns {Promise<Task>} Обновленная задача.
    */
    async updateTaskStatus(id: string, updates: { completed: boolean; endDate?: string }) {
        const updatedTask = await updateTaskStatus(id, updates);
        runInAction(() => {
            const runningIndex = this.runningTasks.findIndex((task) => task.id === id);
            const completedIndex = this.completedTasks.findIndex((task) => task.id === id);
            if (updatedTask.completed) {
                if (runningIndex !== -1) {
                    this.runningTasks.splice(runningIndex, 1);
                    this.completedTasks.push(updatedTask);
                } else if (completedIndex !== -1) {
                    this.completedTasks[completedIndex] = updatedTask;
                }
            } else {
                if (completedIndex !== -1) {
                    this.completedTasks.splice(completedIndex, 1);
                    this.runningTasks.push(updatedTask);
                } else if (runningIndex !== -1) {
                    this.runningTasks[runningIndex] = updatedTask;
                }
            }
        });
        return updatedTask;
    }

    searchTasks(query: string) {
        this.searchQuery = query.toLowerCase();
    }

    get filteredRunningTasks() {
        return this.runningTasks.filter(
            (task) =>
                this.searchQuery === "" ||
                task.title.toLowerCase().includes(this.searchQuery) ||
                (task.description && task.description.toLowerCase().includes(this.searchQuery))
        );
    }

    get filteredCompletedTasks() {
        return this.completedTasks.filter(
            (task) =>
                this.searchQuery === "" ||
                task.title.toLowerCase().includes(this.searchQuery) ||
                (task.description && task.description.toLowerCase().includes(this.searchQuery))
        );
    }
}

export const taskStore = new TaskStore();