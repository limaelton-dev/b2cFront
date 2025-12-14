import { Accordion, AccordionDetails, AccordionSummary, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Category } from "../../../../api/categories/types/category";

export default function CategoriesList({ categories, filters, setFilters }: { categories: Category[], filters: string[], setFilters: (filters: string[]) => void }) {
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
                                            checked={filters.includes(category.id.toString())}
                                            onChange={(event) => setFilters(
                                                event.target.checked 
                                                ? [...filters, category.id.toString()] 
                                                : filters.filter((id) => id !== category.id.toString()))}
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