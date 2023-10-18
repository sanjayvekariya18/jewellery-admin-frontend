import React from 'react'
import { HELPER } from '../../services'
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import StyledTable from '../StyledTable';

export default function SimpleTable({ headerColumns, data, extraData = {} }) {
    return (
        <React.Fragment>
            <StyledTable>
                <TableHead>
                    <TableRow>
                        {headerColumns.map((column, key) => (
                            <TableCell key={key} align={column.align || 'center'}  {...(column.width && { width: column.width })}>
                                {typeof column.headerCell == 'string' ? column.headerCell : column.headerCell({ ...extraData })}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!HELPER.isEmpty(data) && data.map((rawItem, key) => (
                        <TableRow key={key}>
                            {headerColumns.map((column, _key) => (
                                <TableCell key={_key} align={column.align || 'center'}>{column.cell({ item: rawItem, ...extraData })}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </StyledTable>
        </React.Fragment>
    )
}
