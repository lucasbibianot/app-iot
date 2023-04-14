// pages/index.js

import GetSupabase from '../../lib/supabase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const ToDos = () => {
  const { user, isAuthenticated } = useAuth0();
  const [todos, setTodos] = useState([]);
  const supabase = GetSupabase();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data } = await supabase.from('todos').select('*');
      setTodos(data);
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <p>Welcome</p>
      {todos?.length > 0 ? (
        todos.map((todo) => <p key={todo.id}>{todo.content}</p>)
      ) : (
        <p>You have completed all todos!</p>
      )}
    </div>
  );
};

export default ToDos;
