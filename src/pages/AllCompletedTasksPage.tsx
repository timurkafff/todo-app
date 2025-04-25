import { observer } from "mobx-react-lite";
import { taskStore } from "../stores/TaskStore";
import { useEffect } from "react";
import { TaskList } from "./HomePage";

export const AllCompletedTasksPage = observer(() => {
    const { filteredCompletedTasks, loadTasks, isLoading } = taskStore;

    useEffect(() => {
        loadTasks();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FFDDD2] flex items-center justify-center">
                <p className="text-xl text-[#006D77]">Загрузка...</p>
            </div>
        );
    }

    return (
            <div className="min-h-screen bg-[#FFDDD2] flex flex-col items-center p-4">
            <div className="w-full max-w-3xl">
                <TaskList
                    id="completed"
                    title="Completed Tasks"
                    tasks={filteredCompletedTasks}
                    dragDisabled={true}
                    onDelete={taskStore.deleteTask}
                    linkTo="/"
                    linkText="Back to Home"
                />
            </div>
        </div>
    );
});