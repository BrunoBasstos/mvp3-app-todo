// /src/components/Navigation.js

import { useNavigate } from 'react-router-dom';

export default function Navigation() {
    const navigate = useNavigate();

    const goToTasks = () => {
        navigate('/tasks');
    }

    return {
        goToTasks
    }
}