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
    id: 'startDate',
    numeric: true,
    disablePadding: false,
    label: 'Начало',
  },
  {
    id: 'endDate',
    numeric: true,
    disablePadding: false,
    label: 'Конец',
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

function EnhancedTableToolbar({profile, selected, handleCreate, handleDelete, handleEdit}) {
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
          Проекты
        </Typography>
      )}

      {selected.length > 0 && profile.role == 'менеджер' &&
        <Stack direction="row">
          {selected.length == 1 && <Tooltip title="Редактировать">
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>}
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

export default function Projects() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [profile, setProfile] = React.useState(
    JSON.parse(localStorage.getItem('profile'))
  );
  const [projects, setProjects] = React.useState(
    JSON.parse(localStorage.getItem('projects'))
    .map((project, index) => {
        return {...project, id: index};
    })
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = projects.map((n) => n.id);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projects.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(projects, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [projects, order, orderBy, page, rowsPerPage],
  );

  const handleDelete = () => {
    setProjects(projects.filter(project => !selected.includes(project.id)));
    setSelected([]);

    localStorage.setItem('projects', JSON.stringify(projects));
  };

  const handleCreate = () => {
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleEdit = () => {
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar profile={profile} selected={selected}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleCreate={handleCreate}
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
              rowCount={projects.length}
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
                    <TableCell align="right">{row.startDate}</TableCell>
                    <TableCell align="right">{row.endDate}</TableCell>
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
          count={projects.length}
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
                let tempProjects = projects;
                tempProjects.push({
                    title: data.get('title'),
                    description: data.get('description'),
                    startDate: data.get('startDate'),
                    endDate: data.get('endDate')
                });

                setProjects(tempProjects.map((project, index) => {
                    return {...project, id: index};
                }));
                localStorage.setItem('projects', JSON.stringify(projects));

                handleDialogClose();
                return
            }

            setProjects(projects.map(project => {
                if (selected.includes(project.id)) {
                    return {...project,
                        title: data.get('title'),
                        description: data.get('description'),
                        startDate: data.get('startDate'),
                        endDate: data.get('endDate')
                    };
                }

                return project;
            }));
            localStorage.setItem('projects', JSON.stringify(projects));
            
            handleDialogClose();
          },
        }}
      >
        <DialogTitle>{editMode ? 'Редактирование' : 'Создание'} Проекта</DialogTitle>
        <DialogContent>
          <TextField
            required
            id="title"
            name="title"
            label="Название"
            fullWidth
            variant="standard"
            defaultValue={projects.find(project => project.id == selected[0])?.title}
          />
          <TextField
            required
            id="description"
            name="description"
            label="Описание"
            fullWidth
            variant="standard"
            defaultValue={projects.find(project => project.id == selected[0])?.description}
          />
          <TextField
            required
            focused
            id="startDate"
            name="startDate"
            label="Начало"
            variant="standard"
            type="date"
            defaultValue={projects.find(project => project.id == selected[0])?.startDate}
          />
          <TextField
            required
            focused
            id="endDate"
            name="endDate"
            label="Конец"
            variant="standard"
            type="date"
            defaultValue={projects.find(project => project.id == selected[0])?.endDate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button type="submit">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
