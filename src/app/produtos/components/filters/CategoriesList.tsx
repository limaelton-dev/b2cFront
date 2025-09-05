import { Accordion, AccordionDetails, AccordionSummary, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useState } from "react";
import { fetchRootCategories } from "../../../services/category";

const getRootCategories = async () => {
    try {
        const dataCategories = await fetchRootCategories();
        return dataCategories.content;
    } catch (e) {
        console.log('deu pau: ', e)
    }
}

export default function CategoriesList() {
    const [categories, setCategories] = useState([]);
    const loadCategories = async () => {
        try {
            const rootCategories = await getRootCategories();
            setCategories(rootCategories);
        } catch (error) {
            console.log('Deu algum erro: ', error);
            setCategories([]);
        }
    };

    useEffect(() => {
        loadCategories()
    }, [])

    return (
        <div>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography sx={{fontWeight: 'bold'}} component="span">Categorias</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category) => (
                                <FormControlLabel
                                    key={category.id}
                                    control={
                                        <Checkbox
                                            size='small'
                                        />
                                    }
                                    label={category.name}
                                />
                            ))
                        ) : (
                            <Typography variant="body2">Carregando categorias...</Typography>
                        )}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}