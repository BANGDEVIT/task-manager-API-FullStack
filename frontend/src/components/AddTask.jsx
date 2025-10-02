import React, { useState } from 'react'
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { toast } from 'sonner';
import api from '@/lib/axios';

const AddTask = ({handleNewTaskAdd}) => {
  const [newTaskTitle, setNewTaskTitle] = useState();
  const addTasks = async () => {
    if (newTaskTitle.trim()){
      try {
        await api.post("/tasks", {title : newTaskTitle})
        toast.success(`nhiệm vụ ${newTaskTitle} đã được thêm vào`);
        handleNewTaskAdd();
      } catch (error) {
        console.log("lỗi khi thêm nhiệm vụ mới", error)
        toast.error("lỗi khi thêm nhiệm vụ mới")
      }
      setNewTaskTitle("")
    }else {
      toast.error("bạn cần nhập nội dung vào input")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter"){
      addTasks();
    }
  } 
  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần phải làm gì?"
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          value = {newTaskTitle ?? ""}
          onChange = {(e) => setNewTaskTitle(e.target.value)}
          onKeyPress = {handleKeyPress}
        />

        <Button
          variant="gradient"
          size="xl"
          className="px-6"
          onClick={addTasks}
          disabled={!newTaskTitle}
        >
          <Plus className="size-5" 
          />
          Thêm
        </Button>
      </div>
    </Card>
  )
}

export default AddTask
