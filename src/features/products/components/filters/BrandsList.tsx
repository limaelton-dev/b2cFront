import { Accordion, AccordionDetails, AccordionSummary, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Brand } from "../../../api/brands/types/brand";

export default function BrandsList({ brands, filters, setFilters }: { brands: Brand[], filters: string[], setFilters: (filters: string[]) => void }) {
    return (
        <div>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography sx={{fontWeight: 'bold'}} component="span">Marcas</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {Array.isArray(brands) && brands.length > 0 ? (
                            brands.map((brand) => (
                                <FormControlLabel 
                                    key={brand.id} 
                                    control={
                                        <Checkbox 
                                            onChange={(event) => setFilters(event.target.checked ? [...filters, brand.id.toString()] : filters.filter((id) => id !== brand.id.toString()))} 
                                            checked={filters.includes(brand.id.toString())} 
                                            size='small' 
                                        />
                                    } 
                                    label={brand.name} 
                                />
                            ))
                        ) : (
                            <Typography variant="body2">Carregando marcas...</Typography>
                        )}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}