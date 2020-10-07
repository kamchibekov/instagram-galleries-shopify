import React from 'react'
import { connect } from 'react-redux'
import { TextField, ChoiceList } from '@shopify/polaris'
import Integration from './Integration'

class LayoutTools extends React.Component {
  constructor() {
    super()
  }

  toolsChange(key, value) {
    const newTools = this.props.layoutTools
    newTools[this.props.defaultLayout][key] = value
    this.props.dispatch({
      type: 'TOOLS_CHANGE',
      value: newTools,
    })
  }

  getGirdTools() {
    return <div>
      <TextField
        label="Columns count"
        value={this.props.layoutTools.grid.columns_count}
        onChange={(value) => {
          this.toolsChange('columns_count', value)
        }}
        type="number"
        placeholder="e.g 4"
      />
      <TextField
        label="Rows count"
        value={this.props.layoutTools.grid.rows_count}
        onChange={(value) => {
          this.toolsChange('rows_count', value)
        }}
        type="number"
        placeholder="e.g 4"
      />
      <TextField
        label="Column gap"
        value={this.props.layoutTools.grid.column_gap}
        onChange={(value) => {
          this.toolsChange('column_gap', value)
        }}
        type="number"
        placeholder="e.g 4"
        prefix="px"
      />
      <TextField
        label="Row gap"
        value={this.props.layoutTools.grid.row_gap}
        onChange={(value) => {
          this.toolsChange('row_gap', value)
        }}
        type="number"
        placeholder="e.g 4"
        prefix="px"
      />
    </div>
  }

  getSlideTools() {
    return <div>
      <TextField
        label="Displayed images count"
        value={this.props.layoutTools.slide.columns_count}
        // onChange={this.accountEnter}
        placeholder="e.g 4"
      />
    </div>
  }


  getMasonryTools() {
    return <div>
      <div className="inline-flex">
        <ChoiceList
          title={'Main image position'}
          choices={[
            { label: 'Left', value: 'left' },
            { label: 'Middle', value: 'middle' },
            { label: 'Right', value: 'right' },
          ]}
          selected={this.props.layoutTools.masonry.mainImagePosition}
          onChange={(value) => {
            this.toolsChange('mainImagePosition', value)
          }}
        />
      </div>
      <TextField
        label="Rows count"
        // value={this.props.accounts.value}
        // onChange={this.accountEnter}
        placeholder="e.g 4"
      />
    </div>
  }

  getActiveLayoutTools() {
    let activeTool = this.getGirdTools()
    if (this.props.defaultLayout === 'slide') {
      activeTool = this.getSlideTools()
    } else if (this.props.defaultLayout === 'masonry') {
      activeTool = this.getMasonryTools()
    }

    return activeTool
  }

  onLayoutChange(value) {
    this.props.dispatch({ type: 'LAYOUT_CHANGE', value: value })
  }

  render() {
    return <div>
      <div className="layoutTools-component">
        <div className="inline-flex">
          <ChoiceList
            title="Choose layout"
            choices={
              this.props.layout.tabs.map((tab) => ({ label: tab.content, value: tab.type }))
            }
            selected={this.props.layout.default}
            onChange={this.onLayoutChange}
          />
        </div>
        {this.getActiveLayoutTools()}

        <Integration />
      </div>
    </div>
  }
}

export default connect(
  (state) => {
    return {
      layout: state.layout,
      layoutTools: state.layoutTools,
      defaultLayout: state.layout.default,
    }
  },
)(LayoutTools)
