import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import fetch from '../Data/Data-Service';
import { calculateResults } from '../Util'
import _ from 'lodash';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';


const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});


function Row(props) {
    const { row, pointsPerTransaction } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell width="40">
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" align="left" scope="row" width="120">

                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Avatar>{row.name.slice(0, 1).toUpperCase()}</Avatar>
                        </Grid>
                        <Grid item xs={6}>
                            {row.name}
                        </Grid>

                    </Grid>
                </TableCell>
                <TableCell align="right">{row.month}</TableCell>
                <TableCell align="right">{row.numTransactions}</TableCell>
                <TableCell align="right">{row.points}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                {row.month} - Transactions
              </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Reward Points</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        _.filter(pointsPerTransaction, (tRow) => {
                                            return (
                                                row.custid === tRow.custid &&
                                                row.monthNumber === tRow.month
                                            );
                                        }).map((historyRow, index) => (
                                            <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    {historyRow.transactionDt}
                                                </TableCell>
                                                <TableCell align="right">{historyRow.amt}</TableCell>
                                                <TableCell align="right">
                                                    {historyRow.points}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }

                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function CollapsibleTable() {
    const [transactionData, setTransactionData] = React.useState(null);

    React.useEffect(() => {
        fetch().then((data) => {
            const results = calculateResults(data);
            console.log(results)
            setTransactionData(results);
        });
    }, []);
    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Customer</TableCell>
                            <TableCell align="right">Month</TableCell>
                            <TableCell align="right"># of Transactions</TableCell>
                            <TableCell align="right">Reward Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionData && transactionData?.summaryByCustomer.map((row, index) => (
                            <Row key={index} row={row} pointsPerTransaction={transactionData.pointsPerTransaction} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box py={4}>
                <Typography variant="h6" gutterBottom component="div">
                    Total Rewards Points
              </Typography>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Reward Points</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionData && transactionData?.totalPointsByCustomer.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="right">{row.points}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}