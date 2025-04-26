import { useState } from "react";
import { taskStore } from "../stores/TaskStore";
import {FaTasks } from "react-icons/fa";

export const TaskCreation = () => {
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [notes, setNotes] = useState("");

  /**
   * Обрабатывает добавление новой задачи.
   * Проверяет наличие заголовка задачи, отправляет данные в хранилище и сбрасывает форму после успешного добавления.
   * В случае ошибки выводит сообщение в консоль.
   * 
   * @async
   * @returns {Promise<void>} Промис, который разрешается после завершения операции.
  */
  const handleAddTask = async () => {
    if (!title.trim()) {
      alert("Task title is required!");
      return;
    }

    try {
      await taskStore.addTask({
        title,
        description: notes,
        dueDate: endDate,
      });
      setTitle("");
      setEndDate("");
      setPriority("Low");
      setNotes("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFDDD2]">
      <div className="w-[570px] h-[120px] bg-[#83C5BE] flex items-center justify-center rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-white">Create your task</h2>
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
              className="w-[250px] p-2 border-3 border-[#006D77] rounded-md placeholder-[#006D77]"
            />
            <FaTasks className="absolute right-3 top-9 text-[#006D77]" />
          </div>
          <div className="flex flex-col relative">
            <span className="text-sm font-medium text-[#006D77]">End Date</span>
            <input
              type="date"
              placeholder="End date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-[250px] p-2 border-3 border-[#006D77] rounded-md placeholder-[#006D77]"
            />
          </div>
        </div>
        <div className="flex flex-col relative">
          <span className="text-sm font-medium text-[#006D77]">Priority Level</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-[250px] p-2 border-3 border-[#006D77] rounded-md placeholder-[#006D77]"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="flex flex-col relative">
          <span className="text-sm font-medium text-[#006D77]">Notes</span>
          <textarea
            placeholder="Write important notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className=" p-2 border-3 border-[#006D77] rounded-md placeholder-[#006D77]"
          />
        </div>
      </div>
      <button
        onClick={handleAddTask}
        className="mt-4 px-16 py-2 bg-[#006D77] text-white rounded-md hover:bg-[#005f6b] transition"
      >
        Add to list
      </button>
    </div>
  );
};