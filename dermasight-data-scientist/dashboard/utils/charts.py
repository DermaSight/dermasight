import plotly.express as px
import plotly.graph_objects as go


def donut_chart(df, column, title):

    data = (
        df[column]
        .value_counts()
        .reset_index()
    )

    data.columns = [column, "Count"]

    fig = px.pie(
        data,
        names=column,
        values="Count",
        hole=0.55
    )

    fig.update_layout(
        title=title,
        height=500
    )

    return fig


def bar_chart(df, column, title):

    data = (
        df[column]
        .value_counts()
        .reset_index()
    )

    data.columns = [column, "Count"]

    fig = px.bar(
        data,
        x=column,
        y="Count",
        text_auto=True
    )

    fig.update_layout(
        title=title,
        height=500
    )

    return fig


def histogram(df, column, title):

    fig = px.histogram(
        df,
        x=column
    )

    fig.update_layout(
        title=title,
        height=500
    )

    return fig


def box_plot(df, x, y, title):

    fig = px.box(
        df,
        x=x,
        y=y,
        color=x
    )

    fig.update_layout(
        title=title,
        height=500
    )

    return fig