import { Accordion, AccordionDetails, AccordionSummary, Typography, FormGroup, FormControlLabel, Switch } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Filters } from "../../../../types/filters";

interface OthersListProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

export default function OthersList({ filters, setFilters }: OthersListProps) {
    return (
        <div>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography sx={{fontWeight: 'bold'}} component="span">Mais Opções</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup sx={{display: 'flex', justifyContent: 'flex-start'}}>
                        <FormControlLabel control={<Switch defaultChecked={false} />} labelPlacement="start" label="Frete Grátis" />
                        <FormControlLabel control={<Switch defaultChecked={true} />} labelPlacement="start" label="Promoção" />
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}