import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import BarChartIcon from '@mui/icons-material/BarChart';
import AppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { BarChart } from '@mui/x-charts';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Название',
  },
  {
    id: 'description',
    numeric: true,
    disablePadding: false,
    label: 'Описание',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Дата',
  },
  {
    id: 'assigner',
    numeric: true,
    disablePadding: false,
    label: 'Принимающий',
  },
  {
    id: 'assignee',
    numeric: true,
    disablePadding: false,
    label: 'Сдающий',
  },
  {
    id: 'grade',
    numeric: true,
    disablePadding: false,
    label: 'Оценка',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all users',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({profile, selected, handleCreate, handleDelete, handleEdit, handleChart}) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selected.length > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {selected.length > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} выбрано
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Проверки
        </Typography>
      )}

      {selected.length > 0 && profile.role == 'менеджер' &&
        <Stack direction="row">
          {selected.length == 1 && <Stack direction={"row"}>
            <Tooltip title="Динамика">
            <IconButton onClick={handleChart}>
              <BarChartIcon />
            </IconButton>
            </Tooltip>
            <Tooltip title="Редактировать">
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            </Tooltip>
          </Stack>}
          <Tooltip title="Удалить">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>}
        {selected.length == 0 && profile.role == 'менеджер' &&
        <Tooltip title="Создать">
          <IconButton onClick={handleCreate}>
            <AddIcon />
          </IconButton>
        </Tooltip>}
    </Toolbar>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Checks() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [chartOpen, setChartOpen] = React.useState(false);
  const [chartData, setChartData] = React.useState([]);
  const [editMode, setEditMode] = React.useState(false);
  const [profile, setProfile] = React.useState(
    JSON.parse(localStorage.getItem('profile'))
  );
  const [checks, setChecks] = React.useState(
    JSON.parse(localStorage.getItem('checks'))
    .map((check, index) => {
        return {...check, id: index};
    })
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = checks.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - checks.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(checks, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [checks, order, orderBy, page, rowsPerPage],
  );

  const handleDelete = () => {
    setChecks(checks.filter(check => !selected.includes(check.id)));
    setSelected([]);

    localStorage.setItem('checks', JSON.stringify(checks));
  };

  const handleCreate = () => {
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleEdit = () => {
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleChart = () => {
    const assignee = checks.find(check => check.id == selected[0])?.assignee
    setChartData(checks.filter(check => check.assignee == assignee).map(check => {
        return {date: check.date, grade: Number(check.grade)};
    }).sort((a, b) => a.date < b.date ? -1 : 1));

    setChartOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleChartClose = () => {
    setChartOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar profile={profile} selected={selected}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleCreate={handleCreate}
          handleChart={handleChart}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={checks.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.title}
                    </TableCell>
                    <TableCell align="right">{row.description}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.assigner}</TableCell>
                    <TableCell align="right">{row.assignee}</TableCell>
                    <TableCell align="right">{row.grade}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={checks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
        }}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);

            if (!editMode) {
                let tempChecks = checks;
                tempChecks.push({
                    title: data.get('title'),
                    description: data.get('description'),
                    date: data.get('date'),
                    assigner: data.get('assigner'),
                    assignee: data.get('assignee'),
                    grade: data.get('grade')
                });

                setChecks(tempChecks.map((check, index) => {
                    return {...check, id: index};
                }));
                localStorage.setItem('checks', JSON.stringify(checks));

                handleDialogClose();
                return
            }

            setChecks(checks.map(check => {
                if (selected.includes(check.id)) {
                    return {...check,
                        title: data.get('title'),
                        description: data.get('description'),
                        date: data.get('date'),
                        assigner: data.get('assigner'),
                        assignee: data.get('assignee'),
                        grade: data.get('grade')
                    };
                }

                return check;
            }));
            localStorage.setItem('checks', JSON.stringify(checks));
            
            handleDialogClose();
          },
        }}
      >
        <DialogTitle>{editMode ? 'Редактирование' : 'Создание'} Проверки</DialogTitle>
        <DialogContent>
          <TextField
            required
            id="title"
            name="title"
            label="Название"
            fullWidth
            variant="standard"
            defaultValue={checks.find(check => check.id == selected[0])?.title}
          />
          <TextField
            required
            id="description"
            name="description"
            label="Описание"
            fullWidth
            variant="standard"
            defaultValue={checks.find(check => check.id == selected[0])?.description}
          />
          <TextField
            required
            focused
            id="date"
            name="date"
            label="Дата"
            variant="standard"
            type="date"
            defaultValue={checks.find(check => check.id == selected[0])?.date}
          />
          <TextField
            required
            id="assigner"
            name="assigner"
            label="Принимающий"
            variant="standard"
            defaultValue={checks.find(check => check.id == selected[0])?.assigner}
          />
          <TextField
            required
            id="assignee"
            name="assignee"
            label="Сдающий"
            variant="standard"
            defaultValue={checks.find(check => check.id == selected[0])?.assignee}
          />
          <TextField
            required
            id="grade"
            name="grade"
            label="Оценка"
            variant="standard"
            type="number"
            defaultValue={checks.find(check => check.id == selected[0])?.grade}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button type="submit">Сохранить</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen
        open={chartOpen}
        onClose={handleChartClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleChartClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Динамика
            </Typography>
          </Toolbar>
        </AppBar>
        <BarChart
            xAxis={[{ data: chartData.map(cd => cd.date), scaleType: 'band' }]}
            series={[{ data: chartData.map(cd => cd.grade) }]}
            height={500}
        />
      </Dialog>
    </Box>
  );
}
