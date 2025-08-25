# About Sentiment Analysis

## Tools Used
**Python | Jupyter Notebook | spaCy | Fine-tuning | PostgreSQL | Playwright | Flask**

---

## Why?
Several years ago, I built a simple machine learning model to predict stock prices. As you might guess, it was unsuccessful. This failure prompted me to rethink what key factors influence stock prices. After some analysis, I realized the answer was right in front of me: the news, a medium developed centuries ago that remains relevant today.

This led to a new question: instead of predicting a precise stock value, why not try to determine the overall sentiment surrounding a company? This project was born from that idea.

---

## Data Collection
The first step was to collect as much data as possible to train the model. I used Kaggle as my primary data source and found four helpful repositories:

*   [Financial Sentiment Analysis](https://www.kaggle.com/datasets/sbhatti/financial-sentiment-analysis)
*   [Sentiment Analysis for Financial News](https://www.kaggle.com/datasets/ankurzing/sentiment-analysis-for-financial-news)
*   [Twitter Financial News Sentiment Dataset](https://www.kaggle.com/datasets/borhanitrash/twitter-financial-news-sentiment-dataset?select=sent_train.csv)
*   [Aspect based Sentiment Analysis for Financial News](https://www.kaggle.com/datasets/ankurzing/aspect-based-sentiment-analysis-for-financial-news)

These datasets provided a combined total of approximately 30,000 unique rows, each containing a news headline and its corresponding sentiment.

---

## Named Entity Recognition (NER)
While inspecting the data, I noticed that the "Aspect based Sentiment Analysis for Financial News" dataset included the subject of each headline. This sparked an idea: why not train a model to recognize the subject of a phrase?

At first, it seemed simple. I could process the words with a Bag of Words (BoW) and train a small model with Naive Bayes or a Support Vector Machine. However, this approach yielded low accuracy. After more research, I decided to use spaCy and its `en_core_web_sm` pipeline. This gave me a surprising initial accuracy of 84%, which I improved to 87% with further refinements.

I discovered that the subjects in the dataset were not limited to companies but also included names of people, countries, and currencies. The key improvement was to split these subjects into different categories. The final result was an efficient 7MB model with 87% accuracy.

In a second attempt, I fine-tuned a spaCy RoBERTa model. This boosted performance to 90% accuracy, but the model size increased from 7MB to a substantial 500MB. This presents a classic trade-off between accuracy and size. I am satisfied with both models, as each can be effective in different scenarios.

---

## [Sentiment Classification](https://huggingface.co/KOlCi/distilbert-financial-sentiment)
Now for the main event: the sentiment model. I first tried training an SVM model, which performed well on NEUTRAL classifications (around 90% accuracy) but struggled with POSITIVE and NEGATIVE ones (around 60% accuracy). This was much lower than I had hoped, so I shifted my focus to fine-tuning a pre-trained model.

Initially, fine-tuning a large and capable model like LLaMA 3 seemed promising. However, for a personal project, buying a dedicated GPU server was out of scope. I decided to start with smaller models first.

My research led me to the classic RoBERTa architecture and, more specifically, to DistilBERT. As its name suggests, it is a distilled, smaller version of the RoBERTa-base model. Its primary purpose is to be fine-tuned, which fit my task perfectly.

After training, I was pleasantly surprised. The model achieved 85% accuracy with a loss of 0.4076. Minor adjustments to epochs and the learning rate did not significantly change the outcome. A future task is to investigate the cases where the model fails most often and improve upon them (TO-DO).

Since I have moved all GPU-intensive tasks to Kaggle, I may fine-tune LLaMA 3 in the future to achieve even better performance (TO-DO).

---

## Deployment
I was surprised to find that many of the free hosting services I used years ago are now paid. For instance, I used to host a Discord bot on Heroku, but its free tier has changed. My search led me to Render, a platform that generously offers a free web service and database. I did discover that the free storage expires after three months of inactivity.

Another challenge was that the server would occasionally shut down due to inactivity. I solved this by using UptimeRobot to ping the site every 10 minutes, which keeps it running longer. I have heard good things about Vercel and may migrate there one day.

---

## Information Retrieval
My first thought was to use an API to fetch news. However, the free plans from various services offered either a very limited number of requests or provided delayed data. This limitation pushed me toward a different approach: web scraping. My initial attempts with libraries like `requests`, `BeautifulSoup4`, and `Selenium` were blocked.

Then, I discovered Playwright, a powerful library with a sub-library that bypasses simple bot detection. It worked. To be respectful of the news provider's servers, I limited my scraper to making only one request per hour.

---

## Trigger and Workflow
With all the components ready, it was time to build the final system. The first obstacle was that Render's free tier does not offer cron jobs. Fortunately, I found that GitHub Actions could serve as a reliable trigger, running my workflow every hour.

The second obstacle was that Render's free RAM was insufficient to run both of my models. I moved the model execution to Kaggle, which kindly provides 30 hours of free GPU usage per week.

The final workflow is as follows:
1.  A GitHub Action triggers the scraper and the Kaggle notebook every hour.
2.  Kaggle runs the notebook, processing the scraped headlines with the sentiment models.
3.  The results are inserted into the database.
4.  When a user visits the site, the application retrieves and renders the entries with their assigned sentiments.

---

That's all. Thank you for reading.