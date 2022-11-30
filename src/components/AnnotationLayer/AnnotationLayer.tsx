import React, { useRef, useCallback, useContext, useEffect, useState } from 'react';
import { styled } from '@material-ui/core/styles';
import * as d3 from 'd3';
import uniqid from 'uniqid';
import _ from 'lodash';

import { AnnotationContext } from './AnnotationLayerContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { ScreenshotContext } from '../ScreenshotLayer/ScreenshotLayerContext';
import AnnotationToolbar from '../MenuBar/AnnotationToolbar';

const colors = ['#FFFFFF', '#808080', '#000000', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'];

interface IProps {
  data?: object[];
  roomDimensions?: object;
}

const AnnotationContainer = styled('div')({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  'stroke-width': '3px',
  overflow: 'hidden',
  'z-index': '2',
  '& text': {
    cursor: 'pointer',
  },
});

export const AnnotationLayer = (props: IProps) => {
  const d3Container = useRef(null);
  const { roomDimensions } = props;
  const { annotations, dispatch } = useContext(AnnotationContext);
  const { screenshotDispatch } = useContext(ScreenshotContext);
  const { room } = useVideoContext();
  const [tool, setTool] = useState('none');
  const [color, setColor] = useState('#ff0000');
  const [text, setText] = useState('');
  const [selected, setSeleted] = useState('');
  const handleClick = useCallback(
    (item: any) => {
      dispatch(item);
      const [localDataTrackPublication] = [...room.localParticipant.dataTracks.values()];
      localDataTrackPublication.track.send(JSON.stringify(item));
      console.debug(item);
    },
    [dispatch, room]
  );

  d3.selection.prototype.first = function() {
    return d3.select(this.nodes()[0]);
  };
  d3.selection.prototype.last = function() {
    return d3.select(this.nodes()[this.size() - 1]);
  };

  useEffect(() => {
    const size = 4;
    if (d3Container.current) {
      const svg = d3.select(d3Container.current);
      const isShape = tool === 'circle' || tool === 'rect' || tool === 'line' || tool === 'text';

      const newAnnotation = (container: any, event: any) => {
        const x = parseInt(event.x);
        const y = parseInt(event.y);
        const id = `shape_${uniqid()}`;
        let annotation: any = {
          color,
          id,
          category: tool,
        };
        switch (tool) {
          case 'text':
            annotation.x = x;
            annotation.y = y;
            annotation.text = text;
            annotation.fontSize = size * 4 + 'px';
            break;
          case 'circle':
            annotation.cx = x;
            annotation.cy = y;
            annotation.r = size;
            break;
          case 'rect':
            annotation.x = x;
            annotation.y = y;
            annotation.width = size;
            annotation.height = size;
            break;
          case 'line':
            annotation.x1 = x;
            annotation.y1 = y;
            annotation.x2 = x + size;
            annotation.y2 = y + size;
            break;
        }
        return annotation;
      };

      svg.call(
        d3
          .drag<any, any>()
          .on('start', function(event) {
            if (isShape) {
              let container = d3.selectAll(tool);
              const annotation = newAnnotation(container, event);
              screenshotDispatch({ type: 'IS_DRAWING', annotation });
              setSeleted(annotation.id);
              handleClick({ type: 'ADD_ANNOTATION', annotation, roomDimensions });
            }
          })
          .on('drag', function(event: any, d: any) {
            if (isShape) {
              const selectedShapes = d3.selectAll(tool);
              const selectedShape = selectedShapes.filter(`.${tool}:last-child`);
              if (selectedShape) {
                let x: number =
                  parseInt(selectedShape.attr('x')) ||
                  parseInt(selectedShape.attr('cx')) ||
                  parseInt(selectedShape.attr('x1'));
                let y: number =
                  parseInt(selectedShape.attr('cy')) ||
                  parseInt(selectedShape.attr('y')) ||
                  parseInt(selectedShape.attr('y1'));
                switch (tool) {
                  case 'text':
                    selectedShape.attr('font-size', size * 4 + Math.abs(event.y - y));
                    break;
                  case 'circle':
                    const newRadius = Math.hypot(event.x - x, event.y - y);
                    selectedShape.attr('r', newRadius);
                    break;
                  case 'rect':
                    x = parseInt(selectedShape.attr('x'));
                    y = parseInt(selectedShape.attr('y'));
                    if (event.x < x && event.y > y) {
                      selectedShape.attr('transform', `translate(-${Math.abs(x - event.x)}, 0)`);
                    } else if (event.y < y && event.x > x) {
                      selectedShape.attr('transform', `translate(0, -${Math.abs(y - event.y)})`);
                    } else if (event.x < x && event.y < y) {
                      selectedShape.attr(
                        'transform',
                        `translate(-${Math.abs(x - event.x)}, -${Math.abs(y - event.y)})`
                      );
                    }
                    selectedShape.attr('height', Math.abs(y - event.y));
                    selectedShape.attr('width', Math.abs(x - event.x));
                    break;
                  case 'line':
                    selectedShape.attr('y2', event.y);
                    selectedShape.attr('x2', event.x);
                    selectedShape.attr('fill', color);
                    break;
                }
              }
            }
          })
          .on('end', function(event: any, d: any) {
            if (isShape) {
              const selectedShapes = d3.selectAll(tool);
              const selectedShape = selectedShapes.filter(`.${tool}:last-child`);
              let annotation: any = {
                color: selectedShape.attr('stroke'),
                category: tool,
                id: selectedShape.attr('key'),
              };
              if (selectedShape) {
                switch (tool) {
                  case 'text':
                    annotation.x = selectedShape.attr('x');
                    annotation.y = selectedShape.attr('y');
                    annotation.fontSize = selectedShape.attr('font-size');
                    annotation.color = selectedShape.attr('fill');
                    break;
                  case 'circle':
                    annotation.cx = selectedShape.attr('cx');
                    annotation.cy = selectedShape.attr('cy');
                    annotation.r = selectedShape.attr('r');
                    break;
                  case 'rect':
                    annotation.x = selectedShape.attr('x');
                    annotation.y = selectedShape.attr('y');
                    annotation.width = selectedShape.attr('width');
                    annotation.height = selectedShape.attr('height');
                    annotation.transform = selectedShape.attr('transform');
                    break;
                  case 'line':
                    annotation.x1 = selectedShape.attr('x1');
                    annotation.y1 = selectedShape.attr('y1');
                    annotation.x2 = selectedShape.attr('x2');
                    annotation.y2 = selectedShape.attr('y2');
                    break;
                }
                handleClick({ type: 'UPDATE_ANNOTATION', annotation, roomDimensions });
                screenshotDispatch({ type: 'IS_NOT_DRAWING', annotation });
              }
            }
          })
      );

      // Bind D3 data
      // this needs to be refactored for drag functions to be seperate
      const texts = svg.selectAll('text');
      const circles = svg.selectAll('circle');
      const rects = svg.selectAll('rect');
      const lines = svg.selectAll('line');

      texts
        .data(
          annotations.filter(function(d: any) {
            return d.category === 'text';
          })
        )
        .join('text')
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y)
        .attr('key', (d: any) => d.id)
        .attr('class', 'shape text')
        .attr('fill', (d: any) => d.color)
        .attr('font-size', (d: any) => d.fontSize)
        .text((d: any) => d.text);

      circles
        .data(
          annotations.filter(function(d: any) {
            return d.category === 'circle';
          })
        )
        .join('circle')
        .attr('cx', (d: any) => d.cx)
        .attr('cy', (d: any) => d.cy)
        .attr('key', (d: any) => d.id)
        .attr('class', 'shape circle')
        .attr('r', (d: any) => d.r)
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', (d: any) => d.color);

      rects
        .data(
          annotations.filter(function(d: any) {
            return d.category === 'rect';
          })
        )
        .join('rect')
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y)
        .attr('key', (d: any) => d.id)
        .attr('class', 'shape rect')
        .attr('transform', (d: any) => d.transform)
        .attr('width', (d: any) => d.width)
        .attr('height', (d: any) => d.height)
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', (d: any) => d.color);

      lines
        .data(
          annotations.filter(function(d: any) {
            return d.category === 'line';
          })
        )
        .join('line')
        .attr('x1', (d: any) => d.x1)
        .attr('y1', (d: any) => d.y1)
        .attr('x2', (d: any) => d.x2)
        .attr('y2', (d: any) => d.y2)
        .attr('key', (d: any) => d.id)
        .attr('class', 'shape line')
        .attr('stroke', (d: any) => d.color)
        .attr('stroke-width', 10)
        .attr('marker-end', function(d: any) {
          return 'url(#triangle_' + d.color.replace('#', '').toLocaleLowerCase() + ')';
        });

      // add check and drag events to all shape elements
      const shapes = svg
        .selectAll('.shape')
        .call(
          d3
            .drag<any, any>()
            .on('start', function(event) {
              const category = d3
                .select(this)
                .attr('class')
                .split(' ')
                .pop();
              category !== 'text' && d3.select(this).attr('fill', 'rgba(1,1,1,0.5)');
            })
            .on('drag', function(event, d) {
              const category = d3
                .select(this)
                .attr('class')
                .split(' ')
                .pop();
              if (event.sourceEvent.shiftKey) {
                //normal shift drag events per shape
                switch (category) {
                  case 'text':
                    d3.select(this)
                      .raise()
                      .attr('font-size', size * 4 + Math.abs(event.y - d.y));
                    break;
                  case 'circle':
                    d3.select(this)
                      .raise()
                      .attr('cx', (d.x = event.x))
                      .attr('cy', (d.y = event.y));
                    break;
                  case 'rect':
                    let selectedShape = d3.select(this).raise();
                    if (event.x < d.x && event.y > d.y) {
                      selectedShape.attr('transform', `translate(-${Math.abs(d.x - event.x)}, 0)`);
                    } else if (event.y < d.y && event.x > d.x) {
                      selectedShape.attr('transform', `translate(0, -${Math.abs(d.y - event.y)})`);
                    } else if (event.x < d.x && event.y < d.y) {
                      selectedShape.attr(
                        'transform',
                        `translate(-${Math.abs(d.x - event.x)}, -${Math.abs(d.y - event.y)})`
                      );
                    }
                    selectedShape.attr('height', Math.abs(d.y - event.y));
                    selectedShape.attr('width', Math.abs(d.x - event.x));

                    break;
                  case 'line':
                    d3.select(this)
                      .raise()
                      .attr('y2', event.y)
                      .attr('x2', event.x)
                      .attr('fill', color);
                    break;
                }
              } else {
                //normal drag events per shape
                switch (category) {
                  case 'text':
                    d3.select(this)
                      .raise()
                      .attr('x', (d.x = event.x))
                      .attr('y', (d.y = event.y));
                    break;
                  case 'circle':
                    d3.select(this)
                      .raise()
                      .attr('cx', (d.x = event.x))
                      .attr('cy', (d.y = event.y));
                    break;
                  case 'rect':
                    d3.select(this)
                      .raise()
                      .attr('x', (d.x = event.x))
                      .attr('y', (d.y = event.y));
                    break;
                  case 'line':
                    let xDelta = Math.abs(d.x1 - d.x2);
                    let yDelta = Math.abs(d.y1 - d.y2);
                    if (d.x2 < d.x1) {
                      xDelta = -xDelta;
                    }
                    if (d.y2 < d.y1) {
                      yDelta = -yDelta;
                    }
                    d3.select(this)
                      .raise()
                      .attr('x1', (d.x1 = event.x))
                      .attr('y1', (d.y1 = event.y))
                      .attr('x2', (d.x2 = event.x + xDelta))
                      .attr('y2', (d.y2 = event.y + yDelta));
                    break;
                }
              }
            })
            .on('end', function(event, d: any) {
              const category = d3
                .select(this)
                .attr('class')
                .split(' ')
                .pop();
              category !== 'text' && d3.select(this).attr('fill', 'rgba(0,0,0,0)');
              let annotation: any = {};
              switch (category) {
                case 'text':
                  annotation.fontSize = d3.select(this).attr('font-size');
                  annotation.x = d3.select(this).attr('x');
                  annotation.y = d3.select(this).attr('y');
                  break;
                case 'circle':
                  annotation.cx = d3.select(this).attr('cx');
                  annotation.cy = d3.select(this).attr('cy');
                  annotation.r = d3.select(this).attr('r');
                  break;
                case 'rect':
                  annotation.x = d3.select(this).attr('x');
                  annotation.y = d3.select(this).attr('y');
                  annotation.width = d3.select(this).attr('width');
                  annotation.height = d3.select(this).attr('height');
                  break;
                case 'line':
                  annotation.x1 = d3.select(this).attr('x1');
                  annotation.y1 = d3.select(this).attr('y1');
                  annotation.x2 = d3.select(this).attr('x2');
                  annotation.y2 = d3.select(this).attr('y2');
                  break;
              }
              annotation.color = d3.select(this).attr('stroke') || d3.select(this).attr('fill');
              annotation.id = d3.select(this).attr('key');
              handleClick({ type: 'UPDATE_ANNOTATION', annotation, roomDimensions });
            })
        )
        .on('click', function(event, d: any) {
          let annotation = d;
          annotation.id = d3.select(this).attr('key');
          handleClick({ type: 'REMOVE_ANNOTATION', annotation, roomDimensions });
        });

      // Remove old D3 elements
      texts.exit().remove();
      circles.exit().remove();
      rects.exit().remove();
      lines.exit().remove();
      shapes.exit().remove();
    }
  }, [annotations, tool, color, text, screenshotDispatch, handleClick, selected, setSeleted]);

  return (
    <AnnotationContainer>
      <div style={{ width: '100%', height: '100%' }}>
        <svg className="annotation-layer" width={'100%'} height={'100%'} ref={d3Container}>
          <defs>
            {colors.map((item, i) => {
              return (
                <marker
                  id={`triangle_${item.replace('#', '').toLocaleLowerCase()}`}
                  viewBox="0 0 10 10"
                  key={`marker_${i}`}
                  refX="0"
                  refY="5"
                  orient="auto"
                  markerWidth="3"
                  markerHeight="3"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={item} />
                </marker>
              );
            })}
          </defs>
          <rect className="workspace-layer" width={'100%'} height={'100%'} />
        </svg>
        <AnnotationToolbar
          selectedTool={tool}
          handleColor={setColor}
          handleText={setText}
          color={color}
          handleTool={setTool}
          handleDelete={_.partial(handleClick, { type: 'RESTART_ANNOTATION' })}
          roomDimensions={props.roomDimensions}
        />
      </div>
    </AnnotationContainer>
  );
};
