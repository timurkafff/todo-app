import { useState } from "react";
import { taskStore } from "../../stores/TaskStore";
import { FaTasks } from "react-icons/fa";
import { Task } from "../../stores/TaskStore";

interface TaskEditModalProps {
    task: Task;
    onClose: () => void;
}

export const TaskEditModal = ({ task, onClose }: TaskEditModalProps) => {
    const formatDateForInput = (date?: string) =>
        date ? date.split("T")[0] : new Date().toISOString().split("T")[0];

    const [title, setTitle] = useState(task.title);
    const [startDate, setStartDate] = useState(formatDateForInput(task.startDate));
    const [endDate, setEndDate] = useState(formatDateForInput(task.endDate));
    const [priority, setPriority] = useState(task.priority || "Low");
    const [description, setDescription] = useState(task.description || "");

    const handleEditTask = async () => {
        if (!title.trim()) {
            alert("Task title is required!");
            return;
        }

        try {
            await taskStore.updateTask(task.id, {
                title,
                description,
                startDate: startDate || new Date().toISOString(),
                dueDate: endDate || new Date().toISOString(),
                priority,
            });
            onClose();
        } catch (error) {
            console.error("Failed to edit task:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#ffddd228] bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[570px]">
                <div className="w-full h-[120px] bg-[#83C5BE] flex items-center justify-center rounded-lg mb-6">
                    <h2 className="text-2xl font-bold text-white">Edit Task</h2>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col relative">
                            <span className="text-sm font-medium text-[#006D77]">Task Title</span>
                            <input
                                type="text"
                                placeholder="Task title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-[250px] p-2 border-[3px] border-[#006D77] rounded-md placeholder-[#006D77]"
                            />
                            <FaTasks className="absolute right-3 top-9 text-[#006D77]" />
                        </div>
                        <div className="flex flex-col relative">
                            <span className="text-sm font-medium text-[#006D77]">Start Date</span>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-[250px] p-2 border-[3px] border-[#006D77] rounded-md placeholder-[#006D77]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col relative">
                            <span className="text-sm font-medium text-[#006D77]">End Date</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-[250px] p-2 border-[3px] border-[#006D77] rounded-md placeholder-[#006D77]"
                            />
                        </div>
                        <div className="flex flex-col relative">
                            <span className="text-sm font-medium text-[#006D77]">Priority Level</span>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-[250px] p-2 border-[3px] border-[#006D77] rounded-md placeholder-[#006D77]"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col relative">
                        <span className="text-sm font-medium text-[#006D77]">Task Description</span>
                        <textarea
                            placeholder="Write important notes"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="p-2 border-[3px] border-[#006D77] rounded-md placeholder-[#006D77]"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-[#006D77] rounded-md hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEditTask}
                        className="px-6 py-2 bg-[#006D77] text-white rounded-md hover:bg-[#005f6b] transition"
                    >
                        Confirm Edit
                    </button>
                </div>
            </div>
        </div>
    );
};