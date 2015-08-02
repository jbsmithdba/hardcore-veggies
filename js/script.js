window.onload = function(){

  /* instantiate poller from API spec */
  var poller = new window.spredfast.Poller()

  /* create vars for preparing calls to poller and send results to target */
  var types = ['veggies','fruits']
  var targetEl = $('div.mentions')

  /* append to target element using jquery syntax to build DOM elements in code */
  function drawUpdateWithJquery(target_el, item){
    target_el.append(
      $('<li></li>')
        .append($('<div></div>').addClass('mentionitem')
          .append(
            $('<span></span>').text(item.name)
          )
          .append(
            $('<span></span>').text(numeral(item.count).format('0,0')).addClass('counts')
              .append(
                $('<span></span>').text('Mentions').addClass('thin')
              )
          )
        )
    )
  }

  /* call API and handle result */
  function callPoller(poller_instance, types_array, target_el) {
    var count = types_array.length
    var initial_results = []
    var sorted_results  = []

    types_array.forEach(function(type) {
      poller_instance.poll( {'type': type }, function(results) {

        results.forEach(function(item) {
            initial_results.push(item)
        })

        count--

        if(count === 0) {
          target_el.empty()
          /* return the TOP 5 results by forst sorting (low-to-high), then slicing last 5, then reversing */
          sorted_results = initial_results.sort(function(a,b){return a.count - b.count}).slice(-5).reverse()
          sorted_results.forEach(function(item,idx,origArray) {
            drawUpdateWithJquery(target_el,item)
          })
        }

      })
    })
  }

  /* initiate first call to poller */
  callPoller(poller, types, targetEl)

  /* schedule continuous calls to poller every 15 secs */
  setInterval( function(){
    callPoller(poller, types, targetEl)
  },15000)

}