# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| | |
| | |
| | |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).
> 

Our dataset contains one million chess games from the Lichess platform available [here](https://database.lichess.org). Lichess is a famous online chess platform fully free and open source. Each month, the current dataset is put online, available to download. We chose to use an old version of the dataset (August 2014) because the latest ones are far too consequent for easy data handling.

The dataset corresponds to logs of each game, therefore some preprocessing is required to format the logs into a csv.

Each game is described in PGN (Portable Game Notation), which is a standard format for recording every move of a chess game and can be easily read by computers. We also have some metadata such as the mode of the game (Blitz, Normal, Bullet), who won the game and how (Normal, Time forfeit), or the elo of the two players.


### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

By leveraging the previously described dataset, we set our main objective towards providing an overview of the main aspects and strategies of chess for each player level. In other words, we want to give a general and visual understanding of the game that is tailored to users' familiarity with chess. For instance, beginners would be more interested in basic tactics and common moves, intermediates with the most useful openings and advanced with some examples of games from the best players in the dataset. The visualizations would allow each player to explore and get insights from thousands of games, letting them take a new look at chess, use it as a tool to improve their future strategies or spark a new interest for the game.


### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

Here is an example log of a game: 
"Rated Classical game"]\n[Site "https://lichess.org/Gg06eUOY"] [...] \n[TimeControl "420+8"]\n[Termination "Time forfeit"]\n\n1. e4 g6 2. [...]

Thus the metadata is listed at the beginning, followed by the game PGN. The preprocessing extracts all the metadata and the PGN and creates a csv containing everything. The preprocessing is done the notebook parse_raw_data.iypnb

The exploratory data analysis is done in the notebook EDA.ipynb.


### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

Conveniently, there exists an example of preprocessing on the raw dataset on Kaggle [1](https://www.kaggle.com/ironicninja/converting-raw-chess-pgn-to-readable-data). We will start from there and modify it to fit our needs, by extracting more information (e.g. the time mode is not extracted in the example). Along with the preprocessing, some EDA has been performed on the processed data [2](https://www.kaggle.com/ironicninja/online-chess-games). Taking that into account we focused our EDA on what is not already existing, such as the openings.

Our approach offers a visualization of the game that is focused on the level of the player. We want to use this idea to spark curiosity in every player, and to fuel their interest with interactive plots. What already exists are plain chess theory or exciting visualizations lacking explanations/analysis in our sense. We want to take the adaptive learning model of chess theory and combine it with the beauty of data visualization to make the experience both educational and pleasant. 

For instance, a website [3](https://www.chessroots.com) enables to explore the most common chess openings through an interactive graph. It shows the number of games in its dataset which took the same opening path. On the side, we can see what the game looks like on a chess board, dynamically when exploring the graph. Several datasets are available (Lichess, KingBase, ChessEngine…), there are also filters such as the player’s Elo or the game category (Bullet, Blitz, Normal...).

There exists also websites [4](https://medium.com/analytics-vidhya/visualizing-grandmaster-openings-bd2cc3b9cd87) about chess openings, but that usually are focused on analysing the playstyle of famous chess players (“GrandMasters”). They enable us to visualize a map of the most frequent opening (by frequency) of a few players.

Some other visualizations [5](https://flowingdata.com/2015/06/01/chess-piece-moving-patterns/) focus on one particular piece (rook, queen…) and show its most common paths on the board. We think it is an interesting perspective for the analysis but the look of the visualisations could be improved. The current one is not very readable, but it still gives good insights.



## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

