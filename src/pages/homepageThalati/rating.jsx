import React from 'react';
import './rating.css';

function Rating(props) {
  // console.info('starRate--->', props?.starRate);
  const starRating = props?.starRate;
  return (
    <div className="MainDiv">
      <svg class="icon-source">
        <defs>
          <path
            id="star"
            d="M12,1.776l3.286,6.779l7.464,1.032l-5.433,5.221l1.326,7.417L12,18.67l-6.645,3.555l1.327-7.417L1.25,9.587l7.464-1.032L12,1.776z"
          />
        </defs>
      </svg>

      <p dir="rtl" style={{ padding: '9px', margin: '-34px auto' }}>
        <button title="medium" class="medium-rate">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1990/link"
            viewBox="0 0 24 24"
          >
            <use xlinkHref="#star" class={starRating == 3 ? 'icon-star' : 'icon-star-not-fill'} />
          </svg>
        </button>

        <button title="cool" class="normal-rate">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1990/link"
            viewBox="0 0 24 24"
          >
            <use
              xlinkHref="#star"
              class={starRating == 2 || starRating == 3 ? 'icon-star' : 'icon-star-not-fill'}
            />
          </svg>
        </button>
        <button title="the best" class="good-rate">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1990/link"
            viewBox="0 0 24 24"
          >
            <use
              xlinkHref="#star"
              class={
                starRating == 1 || starRating == 2 || starRating == 3
                  ? 'icon-star'
                  : 'icon-star-not-fill'
              }
            />
          </svg>
        </button>
      </p>
    </div>
  );
}

export default Rating;
