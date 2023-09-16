import React, {useState, useEffect} from 'react';
import {Typography, Box} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import LightbulbIcon from '@mui/icons-material/Lightbulb'

const ADVICE_URL = process.env.REACT_APP_ADVICE_URL;
const TRANSLATION_URL = process.env.REACT_APP_TRANSLATION_URL;
const EXPIRATION_TIME = parseInt(process.env.REACT_APP_EXPIRATION_TIME, 10);
const ADVICE_KEY = process.env.REACT_APP_ADVICE_KEY

const getStoredAdvice = () => {
    const stored = localStorage.getItem(ADVICE_KEY);
    if (!stored) return null;

    const {timestamp, advice} = JSON.parse(stored);
    const now = new Date().getTime();
    if (now - timestamp < EXPIRATION_TIME) {
        return advice;
    }

    localStorage.removeItem(ADVICE_KEY);
    return null;
};

const storeAdvice = (advice) => {
    const data = {
        timestamp: new Date().getTime(),
        advice,
    };
    localStorage.setItem(ADVICE_KEY, JSON.stringify(data));
};

const Advice = () => {
    const [advice, setAdvice] = useState(getStoredAdvice);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!advice) {
            fetchAdvice().then(adviceText => {
                setAdvice(adviceText);
                storeAdvice(adviceText);
            });
        }
    }, [advice]);

    const fetchAdvice = async () => {
        setLoading(true);
        try {
            const adviceResponse = await fetch(ADVICE_URL);
            const adviceData = await adviceResponse.json();
            return await translate(adviceData.slip.advice);
        } catch (error) {
            console.error('Erro ao obter conselho:', error);
            setLoading(false);
        }
        return "Conselho não disponível.";
    };

    const translate = async (msg) => {
        try {
            const response = await fetch(`${TRANSLATION_URL}&q=${msg}`);
            const data = await response.json();
            msg = data.responseData.translatedText;
        } catch (error) {
            console.error('Erro ao traduzir:', error);
        }
        setLoading(false);
        return msg;
    };


    return (
        <Box bgcolor="primary.main" color="primary.contrastText" padding={1} borderRadius={1} marginBottom={2}>
            <Typography variant="h6" display="flex" alignItems="center" justifyContent="center">
                {loading
                    ? (
                        <>
                            <CircularProgress size={20}/>
                            {'Carregando conselho...'}
                        </>
                    ) : (
                        <>
                            <LightbulbIcon fontSize="medium" style={{marginRight: 4}} color="lightbulb"/>
                            {advice}
                        </>
                    )
                }
            </Typography>
        </Box>
    );

}
export default Advice;
