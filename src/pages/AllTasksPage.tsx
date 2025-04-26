import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { fetchTasks } from "../api/api";
import { TaskList } from "./HomePage";
import { runInAction } from "mobx";

export const AllTasksPage = observer(() => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadTasks = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTasks();
                runInAction(() => {
                    setTasks(data);
                    setIsLoading(false);
                });
            } catch (error) {
                runInAction(() => {
                    setTasks([]);
                    setIsLoading(false);
                });
            }
        };
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
                    id="all"
                    title="All Tasks"
                    tasks={tasks}
                    dragDisabled={true}
                    onDelete={() => Promise.resolve()}
                    linkTo="/"
                    linkText="Back to Home"
                />
            </div>
        </div>
    );
});