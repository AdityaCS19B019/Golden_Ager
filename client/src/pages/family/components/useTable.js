import React, {useState} from 'react'
import {  Table, TableCell, TableHead, TablePagination, TableRow, TableSortLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles( theme => ({
    table:{
        marginTop: theme.spacing(3),
        '& thread th': {
            fontWeight : '600',
            color : "#2e07ad",
            backgroundColor : "#4e20e6"
        },
        '& tbody td': {
            fontWeight : '300'
        },
        '& tbody tr:hover': {
            backgroundColor : '#fffbf2',
            cursor : 'pointer'
        }
    },
    tableHead : {
        backgroundColor : "#b3b3b3",
        color : "#ffffff"
    }
}))

export default function useTable(records, headCells, filterFn) {

    const classes =useStyles();

    const pages = [5,10,25]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()

    const TblContainer = props => (
        <Table className={classes.table}>
            {props.children}
        </Table>
    )

    const handleSortRequest = cellId => {
        const isAsc = orderBy === cellId && order === "asc";
        setOrder(isAsc?"desc":"asc")
        setOrderBy(cellId)
    }

    const TblHead = props => {
        return (
            <TableHead>
                <TableRow className={classes.tableHead}>
                {
                    headCells.map(headCell =>(
                        <TableCell 
                            key={headCell.id}
                            sortDirection={orderBy === headCell.id?order:false}
                        >
                            {headCell.disableSorting?headCell.label :
                            <TableSortLabel
                                active = {orderBy===headCell.id}
                                direction = {orderBy===headCell.id?'asc':'desc'}
                                onClick = {()=>{handleSortRequest(headCell.id)}}
                            >
                                {headCell.label}
                            </TableSortLabel>
                            }
                        </TableCell>
                    ))
                }
                </TableRow>
            </TableHead>
        )
    }

    const handlePageChange = (event, newPage) =>{
        setPage(newPage)
    }

    const handleRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const TblPagination = () => (<TablePagination 
        component = 'div'
        page = {page}
        rowsPerPageOption = {pages}
        rowsPerPage = {rowsPerPage}
        count = {records.length}
        onChangePage = {handlePageChange}
        onChangeRowsPerPage = {handleRowsPerPage}
    />)

    function stableSort(array, comparator){
        const stabilizedThis = array.map((el, index)=>[el, index]);
        stabilizedThis.sort((a,b)=>{
            const order = comparator(a[0],b[0]);
            if(order !==0) return order;
            return a[1]-b[1];
        })
        return stabilizedThis.map((el) => el[0])
    }

    function getComparator(order, orderBy){
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const recordsAfterPagingAndSorting = () => {
        return stableSort(filterFn.fn(records),getComparator(order, orderBy)).slice(page*rowsPerPage,(page+1)*rowsPerPage)
    }

    return {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    }
}


