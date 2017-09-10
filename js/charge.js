var d6 = Aleatory.dice(6);
var rollNormal = d6.times(2);
var rollSwiftStride = d6
  .map(function(n) { return [n]; })
  .times(3, function(xs, ys) { return xs.concat(ys); })
  .map(function(xs) { var sorted = xs.sort(); return sorted[1] + sorted[2]; });

var colors = ["#950912", "#911E09", "#8E3C0A", "#8B580B", "#87720B", "#7D840C", "#60810C", "#457D0D", "#2B7A0D", "#12770E"];

function computeDistribution(distance, movement, swiftStride, rerollFailure, rerollSuccess) {
  var target = distance - movement;

  var roll = swiftStride ? rollSwiftStride : rollNormal;
  var successful = roll.map(function(x) { return x >= target; });

  if (rerollFailure && !rerollSuccess) {
    return successful.times(2, function(a, b) { return a || b; });
  }

  if (!rerollFailure && rerollSuccess) {
    return successful.times(2, function(a, b) { return a && b; });
  }

  return successful;
}

function update() {
  var distance = $("#distance").val();
  var movement = $("#movement").val();
  var swiftStride = $("#swiftstride").prop("checked");
  var rerollSuccess = $("#reroll-success").prop("checked");
  var rerollFailure = $("#reroll-failure").prop("checked");
  var dist = computeDistribution(distance, movement, swiftStride, rerollFailure, rerollSuccess);

  var prob = dist.probabilityAt(true);
  var text = "" + (parseInt(prob.mul(1000).round().toFraction()) / 10) + "%";
  var index = Math.min(parseInt(prob.mul(10).floor().toFraction()), 9);
  $("#result").text(text).css('color', colors[index]);
}

$(function() {
  $("select").each(function() {
    var elem = $(this);
    var from = parseInt(elem.attr('data-from'));
    var to = parseInt(elem.attr('data-to'));

    for (var i = to; i >= from; i--) {
      elem.prepend("<option value='" + i + "'>" + i + "</option>");
    }
  })

  $(".box select").change(function() {
    var elem = $(this);
    Cookies.set(elem.attr("id"), elem.val(), { expires: 365, path: '' });
    update();
  })

  $(".box input").change(function() {
    var elem = $(this);
    Cookies.set(elem.attr("id"), elem.prop("checked") ? "on" : "off", { expires: 365, path: '' });
    update();
  })

  var defaultDistance = Cookies.get("distance") || "12";
  var defaultMovement = Cookies.get("movement") || "5";
  var defaultSwiftStride = Cookies.get("swiftstride") || "off";
  var defaultRerollFailure = Cookies.get("reroll-failure") || "off";
  var defaultRerollSuccess = Cookies.get("reroll-success") || "off";

  $("#distance").val(defaultDistance);
  $("#movement").val(defaultMovement);
  $("#swiftstride").prop("checked", defaultSwiftStride == "on");
  $("#reroll-failure").prop("checked", defaultRerollFailure == "on");
  $("#reroll-success").prop("checked", defaultRerollSuccess == "on");

  update();
})