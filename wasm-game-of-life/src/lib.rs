mod utils;

use core::fmt;

use wasm_bindgen::prelude::*;
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
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
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



#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
}

impl Universe {

    fn get_vec(&self) -> Vec<u8> {
        
        self.cells.iter().flat_map(|i| i.try_into().ok()).collect()
        
    }
    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
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

    pub fn new(width: u32, height: u32) -> Universe {
        // let width = 64;
        // let height = 64;

        let cells = (0..width * height)
            .map(|i| {
                if i % 2 == 0 || i % 7 == 0 {
                    Cell::Alive
                } else {
                    Cell::Dead
                }
            })
            .collect();

        Universe {
            width,
            height,
            cells,
        }
    }
    pub fn new_empty(width: u32, height: u32) -> Universe {
        let cells = (0..width * height)
            .map(|_| Cell::Dead)
            .collect();
        Universe {
            width,
            height,
            cells,
        }
    }

    pub fn render(&self) -> Vec<u8> {
        self.get_vec()
        // self.to_string()
    }

    pub fn tick(&mut self) {
        let mut next = self.cells.clone();

        for row in 0..self.height {
            for col in 0..self.width {
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

    pub fn set(&mut self, new_grid: Vec<u8>, num_cols: u32, num_rows: u32)  {
        let mut cols = 0;
        if num_cols > self.width {
            cols = num_cols
        } else {
            cols = self.width
        }
        let mut rows = 0;
        if num_rows > self.height {
            rows = num_rows
        } else {
            rows = self.height
        }

        let new_grid: Vec<u8> = Vec::from(Universe::new_empty(cols, rows).get_vec());
        let xOffset = (cols - num_cols) / 2;
        let yOffset = (rows - num_rows) / 2;



    }

}