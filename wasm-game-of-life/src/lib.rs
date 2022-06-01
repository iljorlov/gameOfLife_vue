mod utils;

use core::fmt;
use std::cmp;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_test::console_log;
use std::convert::{TryFrom, TryInto};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str ) {
    let mut res = String::from("Hello, wasm-game-of-life!");
    res.push_str(name);
    alert(res.as_str());
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq,PartialOrd,Ord)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

impl TryFrom<&Cell> for u8 {
    type Error = ();

    fn try_from(value: &Cell) -> Result<u8, ()> {
        // if let Cell::Dead = value { Ok(0 as u8) } else if let Cell::Alive = value {Ok(1 as u8)}  else { Err(()) }
        if value == &Cell::Dead {
            return Ok(0);
        }
        Ok(1)
    }
}

// impl Index<u32> for Vec<Cell>{
//   fn get_index(idx: u32) -> Cell{

//   }
// }

// #[derive]
pub type Cells = Vec<Cell>;

#[wasm_bindgen]
pub struct Universe {
    num_cols: u32,
    num_rows: u32,
    cell_size: u32,
    cells: Cells,
    canvas_id: String,
    context: web_sys::CanvasRenderingContext2d
}

impl Universe {

    fn get_vec(&self) -> Vec<u8> {

        self.cells.iter().flat_map(|i| i.try_into().ok()).collect()

    }
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.num_cols + column) as usize
    }

    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.num_rows - 1, 0, 1].iter().cloned() {
            for delta_col in [self.num_cols - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.num_rows;
                let neighbor_col = (column + delta_col) % self.num_cols;
                let idx = self.get_index(neighbor_row, neighbor_col);
                count += self.cells[idx] as u8;
            }
        }
        count
    }



    // ...
}


/// Public methods, exported to JavaScript.
#[wasm_bindgen]
impl Universe {
    // ...

    pub fn new(cell_size: u32, canvas_id: String) -> Universe {
        // let num_cols = 64;
        // let num_rows = 64;

        let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("wasm-gol-context").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

        let context = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();
        let num_cols = context.canvas().unwrap().width() / u32::from(cell_size);
        let num_rows = context.canvas().unwrap().height() / u32::from(cell_size);


        let cells = (0..num_cols * num_rows)
            .map(|i| {
                if i % 2 == 0 || i % 7 == 0 {
                    Cell::Alive
                } else {
                    Cell::Dead
                }
            })
            .collect();

        Universe {
            num_cols,
            num_rows,
            cells,
            cell_size,
            canvas_id,
            context
        }
    }
    pub fn new_empty(cell_size: u32, canvas_id: String) -> Universe {
      let document = web_sys::window().unwrap().document().unwrap();
        let canvas = document.get_element_by_id("wasm-gol-context").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas
        .dyn_into::<web_sys::HtmlCanvasElement>()
        .map_err(|_| ())
        .unwrap();

        let context = canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()
        .unwrap();

        let num_cols = context.canvas().unwrap().width() / u32::from(cell_size);
        let num_rows = context.canvas().unwrap().height() / u32::from(cell_size);


        let cells = (0..num_cols * num_rows)
            .map(|_| Cell::Dead)
            .collect();
        Universe {
            num_cols,
            num_rows,
            cells,
            cell_size,

            canvas_id,
            context
        }
    }

    pub fn render(&self) -> Vec<u8> {
        self.get_vec()
        // self.to_string()
    }

    pub fn tick(&mut self) {
        let mut next = self.cells.clone();

        for row in 0..self.num_rows {
            for col in 0..self.num_cols {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                let next_cell = match (cell, live_neighbors) {
                    // Rule 1: Any live cell with fewer than two live neighbours
                    // dies, as if caused by underpopulation.
                    (Cell::Alive, x) if x < 2 => Cell::Dead,
                    // Rule 2: Any live cell with two or three live neighbours
                    // lives on to the next generation.
                    (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
                    // Rule 3: Any live cell with more than three live
                    // neighbours dies, as if by overpopulation.
                    (Cell::Alive, x) if x > 3 => Cell::Dead,
                    // Rule 4: Any dead cell with exactly three live neighbours
                    // becomes a live cell, as if by reproduction.
                    (Cell::Dead, 3) => Cell::Alive,
                    // All other cells remain in the same state.
                    (otherwise, _) => otherwise,
                };

                next[idx] = next_cell;
            }
        }

        self.cells = next;
    }

    pub fn set(&mut self, mut grid_to_insert: Vec<u8>, mut cols_to_insert: u32, mut rows_to_insert: u32)  {
        grid_to_insert  = vec![0,0,0,1,1,1,0,0,0];
        cols_to_insert = 3;
        rows_to_insert = 3;

        let mut cols = 0;
        if cols_to_insert > self.num_cols {
            cols = cols_to_insert
        } else {
            cols = self.num_cols
        }
        let mut rows = 0;
        if rows_to_insert > self.num_rows {
            rows = rows_to_insert
        } else {
            rows = self.num_rows
        }
        let padding = 30;
        cols = cols + padding;
        rows = rows + padding;

        let cell_size = self.context.canvas().unwrap().width() / cols;

        // let new_grid: Vec<u8> = Vec::from(Universe::new_empty(self.cell_size, self.canvas_id.to_owned()).get_vec());
        let mut new_cells = Universe::new_empty(cell_size, self.canvas_id.to_owned()).cells;
        self.cell_size = cell_size;
        self.num_cols = cols;
        self.num_rows = rows;

        // let new_grid: Vec<u8> = Vec::from(Universe::new_empty(self.cell_size, self.canvas_id.to_owned()).get_vec());
        let x_offset = ((cols - cols_to_insert) / 2) as usize;
        let y_offset = ((rows - rows_to_insert) / 2) as usize;

        let mut two_d_cells: Vec<Vec<Cell>> = Vec::new();
        for chunk in new_cells.chunks(cols as usize) {
          two_d_cells.push(Vec::from(chunk));
        }

        let mut two_d_to_insert: Vec<Vec<Cell>> = Vec::new();
        for chunk in grid_to_insert.chunks(cols_to_insert as usize) {
          two_d_to_insert.push(Vec::from(chunk.iter().map(|cell| {
            if *cell == 1 {
              return Cell::Alive
            }
            Cell::Dead
          }).collect::<Vec<Cell>>()));
        }

        // for (let row = 0; i < gridToInsert.length; i++) {
        //   for (let col = 0; j < gridToInsert[0].length; j++) {
        //     const yPos = Math.max((row + offsetY) % grid.length, 0)
        //     const xPos = Math.max((col + offsetX) % grid[0].length, 0)
        //     const valToInsert = gridToInsert[row][col]

        //     grid[yPos][xPos] = valToInsert
        //   }
        // }
        for (row_idx, row) in two_d_to_insert.iter().enumerate() {
          for (col_idx, cell) in row.iter().enumerate(){
            let y_pos = cmp::max((row_idx + y_offset) % two_d_to_insert.len(), 0);
            let x_pos = cmp::max((col_idx + x_offset) % two_d_to_insert[0].len(), 0);
            let val_to_insert = two_d_to_insert[row_idx][col_idx];
            two_d_cells[y_pos][x_pos] = val_to_insert;
          }
        }
        let mut flat_final:Vec<Cell> = Vec::new();
        two_d_cells.iter().for_each(|x| x.iter().for_each(|cell| flat_final.push(*cell)));
        self.cells = flat_final;

        // row * self.num_cols + column


    }


    pub fn draw_grid(&mut self) {

      self.context.clear_rect(0.0, 0.0, f64::from(self.context.canvas().unwrap().width()), f64::from(self.context.canvas().unwrap().height()));
      // let num_cols = f64::from(self.num_cols);
      // let canv_width = f64::from(self.context.canvas().unwrap().width());
      // let cell_size = canv_width / num_cols;
      self.context.set_fill_style(&"#8200FF".into());
      let cell_size = f64::from(self.cell_size);
      for col in 0..self.num_cols {
        for row in 0..self.num_rows {
          let offset_x = f64::from(col) * cell_size;
          let offset_y = f64::from(row) * cell_size;
          let idx = self.get_index(row, col);
          let value = self.cells[idx];
          if value == Cell::Alive {
            self.context.fill_rect(offset_x, offset_y, cell_size, cell_size);
          }
        }
      }
    }

}
