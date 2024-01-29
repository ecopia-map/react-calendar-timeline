import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { _get, arraysEqual } from '../utility/generic'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export default class Sidebar extends Component {
  static propTypes = {
    groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    groupHeights: PropTypes.array.isRequired,
    keys: PropTypes.object.isRequired,
    groupRenderer: PropTypes.func,
    isRightSidebar: PropTypes.bool,
    allowGroupDraggable: PropTypes.bool,
    onDragEnd: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragUpdate: PropTypes.func,
    onBeforeCapture: PropTypes.func,
    onBeforeDragStart: PropTypes.func,
  }

  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width &&
      nextProps.height === this.props.height &&
      arraysEqual(nextProps.groups, this.props.groups) &&
      arraysEqual(nextProps.groupHeights, this.props.groupHeights)
    )
  }

  renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey) {
    if (this.props.groupRenderer) {
      return React.createElement(this.props.groupRenderer, {
        group,
        isRightSidebar
      })
    } else {
      return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey)
    }
  }

  render() {
    const { width, groupHeights, height, isRightSidebar } = this.props

    const { groupIdKey, groupTitleKey, groupRightTitleKey } = this.props.keys

    const sidebarStyle = {
      width: `${width}px`,
      height: `${height}px`
    }

    const groupsStyle = {
      width: `${width}px`
    }

    let groupLines = this.props.groups.map((group, index) => {
      const elementStyle = {
        height: `${groupHeights[index]}px`,
        lineHeight: `${groupHeights[index]}px`
      }

      return this.props.allowGroupDraggable ? (
        <Draggable key={`${group[groupIdKey]}`} draggableId={`${group[groupIdKey]}`} index={index}>
          {(provided, snapshot) => {
            return (
              <div
                key={_get(group, groupIdKey)}
                className={
                  'rct-sidebar-row rct-sidebar-row-' + (index % 2 === 0 ? 'even' : 'odd')
                }
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  ...elementStyle,
                  ...provided.draggableProps.style,
                }}
              >
                {this.renderGroupContent(
                  group,
                  isRightSidebar,
                  groupTitleKey,
                  groupRightTitleKey
                )}
              </div>
            )}
          }
          </Draggable>
       ) : (
         <div
           key={_get(group, groupIdKey)}
           className={
             'rct-sidebar-row rct-sidebar-row-' + (index % 2 === 0 ? 'even' : 'odd')
           }
           style={{...elementStyle}}
         >
           {this.renderGroupContent(
             group,
             isRightSidebar,
             groupTitleKey,
             groupRightTitleKey
           )}
         </div>
       )
    })

    return (
      <div
        className={'rct-sidebar' + (isRightSidebar ? ' rct-sidebar-right' : '')}
        style={sidebarStyle}
      >
        {this.props.allowGroupDraggable ? (
          <DragDropContext
            onDragEnd={this.props.onDragEnd}
            onBeforeCapture={this.props.onBeforeCapture || null}
            onBeforeDragStart={this.props.onBeforeDragStart || null}
            onDragStart={this.props.onDragStart || null}
            onDragUpdate={this.props.onDragUpdate || null}
          >
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  style={groupsStyle}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {groupLines}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div
            style={groupsStyle}
          >
            {groupLines}
          </div>
        )}
      </div>
    )
  }
}
