import { Task } from "../stores/TaskStore";

const API_URL = "http://localhost:3000/api/tasks";

export const fetchRunningTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_URL}/not-completed`);
    if (!response.ok) return [];
    return response.json();
};

export const fetchCompletedTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_URL}/completed`);
    if (!response.ok) return [];
    return response.json();
};

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) return [];
    return response.json();
};

export const addTask = async (task: Omit<Task, "id" | "completed" | "createdAt" | "deleted" | "order">): Promise<Task> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Failed to add task");
    return response.json();
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
};

export const updateTaskStatus = async (id: string, updates: { completed: boolean; endDate?: string }): Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update task status");
    return response.json();
};

export const deleteTask = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
};